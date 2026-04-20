import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, MapPin } from 'lucide-react';

interface Station {
  id: string;
  station_code: string;
  station_name: string;
  created_at: string;
}

interface DivisionStationManagementProps {
  divisionId: string;
}

export const DivisionStationManagement = ({ divisionId }: DivisionStationManagementProps) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ station_code: '', station_name: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchStations();
  }, [divisionId]);

  const fetchStations = async () => {
    try {
      const { data, error } = await supabase
        .from('railway_stations')
        .select('*')
        .eq('division_id', divisionId)
        .order('station_code');

      if (error) throw error;
      setStations(data || []);
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
      const { error } = await supabase
        .from('railway_stations')
        .insert([{ ...formData, division_id: divisionId }]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Station created successfully',
      });

      setDialogOpen(false);
      setFormData({ station_code: '', station_name: '' });
      fetchStations();
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
          <CardTitle>Station Management</CardTitle>
          <CardDescription>Create and manage stations in your division</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Station
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Station</DialogTitle>
              <DialogDescription>Add a new railway station to your division</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="station_code">Station Code</Label>
                <Input
                  id="station_code"
                  placeholder="e.g., CSMT, BCT"
                  value={formData.station_code}
                  onChange={(e) => setFormData({ ...formData, station_code: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="station_name">Station Name</Label>
                <Input
                  id="station_name"
                  placeholder="e.g., Mumbai Central"
                  value={formData.station_name}
                  onChange={(e) => setFormData({ ...formData, station_name: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                Create Station
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading stations...</div>
        ) : stations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No stations found. Create your first station to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Station Code</TableHead>
                <TableHead>Station Name</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell className="font-medium">{station.station_code}</TableCell>
                  <TableCell>{station.station_name}</TableCell>
                  <TableCell>{new Date(station.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};