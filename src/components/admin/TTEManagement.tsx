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

interface TTE {
  id: string;
  user_id: string;
  tte_code: string;
  status: string;
  station_id: string;
  assigned_at: string;
  railway_stations: { station_code: string; station_name: string };
}

interface Station {
  id: string;
  station_code: string;
  station_name: string;
}

export const TTEManagement = () => {
  const { user } = useAuth();
  const [ttes, setTTEs] = useState<TTE[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', tte_code: '', station_id: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ttesRes, stationsRes] = await Promise.all([
        supabase
          .from('ttes')
          .select('*, railway_stations(station_code, station_name)')
          .order('assigned_at', { ascending: false }),
        supabase.from('railway_stations').select('*').order('station_code'),
      ]);

      if (ttesRes.error) throw ttesRes.error;
      if (stationsRes.error) throw stationsRes.error;

      setTTEs(ttesRes.data || []);
      setStations(stationsRes.data || []);
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
      // Get user_id from profiles using user_id (which we'll use as email input temporarily)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('user_id', formData.email)
        .single();

      if (profileError) {
        throw new Error('User not found. Please ensure the user has signed up first.');
      }

      // Insert TTE record
      const { error } = await supabase.from('ttes').insert([{
        user_id: profileData.user_id,
        tte_code: formData.tte_code,
        station_id: formData.station_id,
        assigned_by: user?.id,
        status: 'active',
      }]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'TTE assigned successfully',
      });

      setDialogOpen(false);
      setFormData({ email: '', tte_code: '', station_id: '' });
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
          <CardTitle>TTE Management</CardTitle>
          <CardDescription>Manage Ticket Traveling Examiners</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add TTE
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign TTE</DialogTitle>
              <DialogDescription>Assign a user as TTE to a station</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">User ID</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter user UUID"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">Enter the user's UUID from the profiles table</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tte_code">TTE Code</Label>
                <Input
                  id="tte_code"
                  placeholder="e.g., TTE001"
                  value={formData.tte_code}
                  onChange={(e) => setFormData({ ...formData, tte_code: e.target.value })}
                  required
                />
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
              <Button type="submit" className="w-full" disabled={loading}>
                Assign TTE
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading TTEs...</div>
        ) : ttes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No TTEs assigned yet. Assign your first TTE to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>TTE Code</TableHead>
                <TableHead>Station</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ttes.map((tte) => (
                <TableRow key={tte.id}>
                  <TableCell>{tte.user_id.substring(0, 8)}...</TableCell>
                  <TableCell className="font-medium">{tte.tte_code}</TableCell>
                  <TableCell>{tte.railway_stations.station_code}</TableCell>
                  <TableCell>
                    <Badge variant={tte.status === 'active' ? 'default' : 'secondary'}>
                      {tte.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
