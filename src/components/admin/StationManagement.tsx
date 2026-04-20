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
import { Plus, MapPin } from 'lucide-react';

interface Station {
  id: string;
  station_code: string;
  station_name: string;
  division_id: string;
  divisions: { division_code: string; division_name: string };
}

interface Division {
  id: string;
  division_code: string;
  division_name: string;
}

export const StationManagement = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ station_code: '', station_name: '', division_id: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stationsRes, divisionsRes] = await Promise.all([
        supabase.from('railway_stations').select('*, divisions(division_code, division_name)').order('station_code'),
        supabase.from('divisions').select('*').order('division_code'),
      ]);

      if (stationsRes.error) throw stationsRes.error;
      if (divisionsRes.error) throw divisionsRes.error;

      setStations(stationsRes.data || []);
      setDivisions(divisionsRes.data || []);
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
      const { error } = await supabase.from('railway_stations').insert([formData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Station created successfully',
      });

      setDialogOpen(false);
      setFormData({ station_code: '', station_name: '', division_id: '' });
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
          <CardTitle>Station Management</CardTitle>
          <CardDescription>Create and manage railway stations</CardDescription>
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
              <DialogDescription>Add a new railway station to a division</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <TableHead>Division</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell className="font-medium">{station.station_code}</TableCell>
                  <TableCell>{station.station_name}</TableCell>
                  <TableCell>{station.divisions.division_code}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
