import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Building2 } from 'lucide-react';

interface Division {
  id: string;
  division_code: string;
  division_name: string;
  zone_id: string;
  zones: { zone_code: string; zone_name: string };
}

interface Zone {
  id: string;
  zone_code: string;
  zone_name: string;
}

export const DivisionManagement = () => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ division_code: '', division_name: '', zone_id: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [divisionsRes, zonesRes] = await Promise.all([
        supabase.from('divisions').select('*, zones(zone_code, zone_name)').order('division_code'),
        supabase.from('zones').select('*').order('zone_code'),
      ]);

      if (divisionsRes.error) throw divisionsRes.error;
      if (zonesRes.error) throw zonesRes.error;

      setDivisions(divisionsRes.data || []);
      setZones(zonesRes.data || []);
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
      const { error } = await supabase.from('divisions').insert([formData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Division created successfully',
      });

      setDialogOpen(false);
      setFormData({ division_code: '', division_name: '', zone_id: '' });
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
          <CardTitle>Division Management</CardTitle>
          <CardDescription>Create and manage railway divisions</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Division
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Division</DialogTitle>
              <DialogDescription>Add a new railway division to a zone</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="zone">Zone</Label>
                <Select value={formData.zone_id} onValueChange={(value) => setFormData({ ...formData, zone_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.zone_code} - {zone.zone_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="division_code">Division Code</Label>
                <Input
                  id="division_code"
                  placeholder="e.g., BB, CSMT"
                  value={formData.division_code}
                  onChange={(e) => setFormData({ ...formData, division_code: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="division_name">Division Name</Label>
                <Input
                  id="division_name"
                  placeholder="e.g., Mumbai Division"
                  value={formData.division_name}
                  onChange={(e) => setFormData({ ...formData, division_name: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                Create Division
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading divisions...</div>
        ) : divisions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No divisions found. Create your first division to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Division Code</TableHead>
                <TableHead>Division Name</TableHead>
                <TableHead>Zone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {divisions.map((division) => (
                <TableRow key={division.id}>
                  <TableCell className="font-medium">{division.division_code}</TableCell>
                  <TableCell>{division.division_name}</TableCell>
                  <TableCell>{division.zones.zone_code}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
