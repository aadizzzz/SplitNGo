import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Users } from 'lucide-react';

interface StationAdmin {
  id: string;
  user_id: string;
  station_id: string;
  is_active: boolean;
  assigned_at: string;
  railway_stations: { station_code: string; station_name: string };
}

interface Station {
  id: string;
  station_code: string;
  station_name: string;
}

interface DivisionStationAdminManagementProps {
  divisionId: string;
}

export const DivisionStationAdminManagement = ({ divisionId }: DivisionStationAdminManagementProps) => {
  const { user } = useAuth();
  const [stationAdmins, setStationAdmins] = useState<StationAdmin[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ user_id: '', station_id: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [divisionId]);

  const fetchData = async () => {
    try {
      // Get stations in this division
      const { data: stationsData, error: stationsError } = await supabase
        .from('railway_stations')
        .select('*')
        .eq('division_id', divisionId)
        .order('station_code');

      if (stationsError) throw stationsError;
      setStations(stationsData || []);

      // Get station admins for these stations
      const stationIds = stationsData?.map(s => s.id) || [];
      if (stationIds.length > 0) {
        const { data: adminsData, error: adminsError } = await supabase
          .from('station_admins')
          .select('*, railway_stations(station_code, station_name)')
          .in('station_id', stationIds)
          .order('assigned_at', { ascending: false });

        if (adminsError) throw adminsError;
        setStationAdmins(adminsData || []);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verify user exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('user_id', formData.user_id)
        .single();

      if (profileError) {
        throw new Error('User not found. Please ensure the user has signed up first.');
      }

      // Insert station admin
      const { error } = await supabase
        .from('station_admins')
        .insert([{
          user_id: profileData.user_id,
          station_id: formData.station_id,
          assigned_by: user?.id,
        }]);

      if (error) throw error;

      // Assign station_admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{
          user_id: profileData.user_id,
          role: 'station_admin',
          assigned_by: user?.id,
        }]);

      if (roleError) console.error('Role assignment error:', roleError);

      toast({
        title: 'Success',
        description: 'Station admin assigned successfully',
      });

      setDialogOpen(false);
      setFormData({ user_id: '', station_id: '' });
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Station Admin Management</CardTitle>
          <CardDescription>Assign station admins to stations in your division</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Assign Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Station Admin</DialogTitle>
              <DialogDescription>Assign a user as station admin</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user_id">User ID</Label>
                <Input
                  id="user_id"
                  type="text"
                  placeholder="Enter user UUID"
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">Enter the user's UUID from the profiles table</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="station">Station</Label>
                <Select value={formData.station_id} onValueChange={(value) => setFormData({ ...formData, station_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.station_code} - {station.station_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={loading || stations.length === 0}>
                Assign Admin
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading station admins...</div>
        ) : stationAdmins.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No station admins assigned yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Station</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stationAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.user_id.substring(0, 8)}...</TableCell>
                  <TableCell>{admin.railway_stations.station_code}</TableCell>
                  <TableCell>
                    <Badge variant={admin.is_active ? 'default' : 'secondary'}>
                      {admin.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(admin.assigned_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};