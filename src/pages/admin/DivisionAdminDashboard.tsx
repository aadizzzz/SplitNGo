import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, MapPin, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DivisionStationManagement } from '@/components/admin/DivisionStationManagement';
import { DivisionStationAdminManagement } from '@/components/admin/DivisionStationAdminManagement';

const DivisionAdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalStations: 0,
    totalStationAdmins: 0,
    totalTTEs: 0,
  });
  const [divisionId, setDivisionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Get division admin's division
        const { data: divisionAdminData, error: divisionAdminError } = await supabase
          .from('division_admins')
          .select('division_id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (divisionAdminError) throw divisionAdminError;
        setDivisionId(divisionAdminData.division_id);

        // Get stations in this division
        const { data: stationsData, count: stationsCount } = await supabase
          .from('railway_stations')
          .select('id', { count: 'exact' })
          .eq('division_id', divisionAdminData.division_id);

        // Get station admins for this division
        const stationIds = stationsData?.map(s => s.id) || [];
        const { count: stationAdminsCount } = await supabase
          .from('station_admins')
          .select('*', { count: 'exact', head: true })
          .in('station_id', stationIds)
          .eq('is_active', true);

        // Get TTEs at stations in this division
        const { count: ttesCount } = await supabase
          .from('ttes')
          .select('*', { count: 'exact', head: true })
          .in('station_id', stationIds)
          .eq('status', 'active');

        setStats({
          totalStations: stationsCount || 0,
          totalStationAdmins: stationAdminsCount || 0,
          totalTTEs: ttesCount || 0,
        });
      } catch (error: any) {
        console.error('Error fetching stats:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    };

    fetchStats();
  }, [user, toast]);

  return (
    <div className="responsive-container py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Division Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your railway division</p>
          </div>
          <Building2 className="w-12 h-12 text-primary" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Station Admins</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStationAdmins}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">TTEs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTTEs}</div>
            </CardContent>
          </Card>
        </div>

        {divisionId && (
          <Tabs defaultValue="stations" className="space-y-4">
            <TabsList>
              <TabsTrigger value="stations">Stations</TabsTrigger>
              <TabsTrigger value="admins">Station Admins</TabsTrigger>
            </TabsList>

            <TabsContent value="stations" className="space-y-4">
              <DivisionStationManagement divisionId={divisionId} />
            </TabsContent>

            <TabsContent value="admins" className="space-y-4">
              <DivisionStationAdminManagement divisionId={divisionId} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default DivisionAdminDashboard;
