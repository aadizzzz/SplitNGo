import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Building2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ZoneDivisionManagement } from '@/components/admin/ZoneDivisionManagement';
import { ZoneDivisionAdminManagement } from '@/components/admin/ZoneDivisionAdminManagement';

const ZoneAdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalDivisions: 0,
    totalDivisionAdmins: 0,
    totalStations: 0,
  });
  const [zoneId, setZoneId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Get zone admin's zone
        const { data: zoneAdminData, error: zoneAdminError } = await supabase
          .from('zone_admins')
          .select('zone_id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (zoneAdminError) throw zoneAdminError;
        setZoneId(zoneAdminData.zone_id);

        // Get divisions in this zone
        const { data: divisionsData, count: divisionsCount } = await supabase
          .from('divisions')
          .select('id', { count: 'exact' })
          .eq('zone_id', zoneAdminData.zone_id);

        // Get division admins for this zone
        const divisionIds = divisionsData?.map(d => d.id) || [];
        const { count: divisionAdminsCount } = await supabase
          .from('division_admins')
          .select('*', { count: 'exact', head: true })
          .in('division_id', divisionIds)
          .eq('is_active', true);

        // Get stations in divisions of this zone
        const { count: stationsCount } = await supabase
          .from('railway_stations')
          .select('*', { count: 'exact', head: true })
          .in('division_id', divisionIds);

        setStats({
          totalDivisions: divisionsCount || 0,
          totalDivisionAdmins: divisionAdminsCount || 0,
          totalStations: stationsCount || 0,
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
            <h1 className="text-3xl font-bold gradient-text">Zone Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your railway zone</p>
          </div>
          <MapPin className="w-12 h-12 text-primary" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Divisions</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDivisions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Division Admins</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDivisionAdmins}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStations}</div>
            </CardContent>
          </Card>
        </div>

        {zoneId && (
          <Tabs defaultValue="divisions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="divisions">Divisions</TabsTrigger>
              <TabsTrigger value="admins">Division Admins</TabsTrigger>
            </TabsList>

            <TabsContent value="divisions" className="space-y-4">
              <ZoneDivisionManagement zoneId={zoneId} />
            </TabsContent>

            <TabsContent value="admins" className="space-y-4">
              <ZoneDivisionAdminManagement zoneId={zoneId} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ZoneAdminDashboard;
