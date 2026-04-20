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

interface DivisionAdmin {
  id: string;
  user_id: string;
  division_id: string;
  is_active: boolean;
  assigned_at: string;
  divisions: { division_code: string; division_name: string };
}

interface Division {
  id: string;
  division_code: string;
  division_name: string;
}

interface ZoneDivisionAdminManagementProps {
  zoneId: string;
}

export const ZoneDivisionAdminManagement = ({ zoneId }: ZoneDivisionAdminManagementProps) => {
  const { user } = useAuth();
  const [divisionAdmins, setDivisionAdmins] = useState<DivisionAdmin[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ user_id: '', division_id: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [zoneId]);

  const fetchData = async () => {
    try {
      // Get divisions in this zone
      const { data: divisionsData, error: divisionsError } = await supabase
        .from('divisions')
        .select('*')
        .eq('zone_id', zoneId)
        .order('division_code');

      if (divisionsError) throw divisionsError;
      setDivisions(divisionsData || []);

      // Get division admins for these divisions
      const divisionIds = divisionsData?.map(d => d.id) || [];
      if (divisionIds.length > 0) {
        const { data: adminsData, error: adminsError } = await supabase
          .from('division_admins')
          .select('*, divisions(division_code, division_name)')
          .in('division_id', divisionIds)
          .order('assigned_at', { ascending: false });

        if (adminsError) throw adminsError;
        setDivisionAdmins(adminsData || []);
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

      // Insert division admin
      const { error } = await supabase
        .from('division_admins')
        .insert([{
          user_id: profileData.user_id,
          division_id: formData.division_id,
          assigned_by: user?.id,
        }]);

      if (error) throw error;

      // Assign division_admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{
          user_id: profileData.user_id,
          role: 'division_admin',
          assigned_by: user?.id,
        }]);

      if (roleError) console.error('Role assignment error:', roleError);

      toast({
        title: 'Success',
        description: 'Division admin assigned successfully',
      });

      setDialogOpen(false);
      setFormData({ user_id: '', division_id: '' });
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
          <CardTitle>Division Admin Management</CardTitle>
          <CardDescription>Assign division admins to divisions in your zone</CardDescription>
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
              <DialogTitle>Assign Division Admin</DialogTitle>
              <DialogDescription>Assign a user as division admin</DialogDescription>
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
                <Label htmlFor="division">Division</Label>
                <Select value={formData.division_id} onValueChange={(value) => setFormData({ ...formData, division_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a division" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((division) => (
                      <SelectItem key={division.id} value={division.id}>
                        {division.division_code} - {division.division_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={loading || divisions.length === 0}>
                Assign Admin
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading division admins...</div>
        ) : divisionAdmins.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No division admins assigned yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {divisionAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.user_id.substring(0, 8)}...</TableCell>
                  <TableCell>{admin.divisions.division_code}</TableCell>
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