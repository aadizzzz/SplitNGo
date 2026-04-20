import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, MapPin, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ZoneManagement } from '@/components/admin/ZoneManagement';
import { DivisionManagement } from '@/components/admin/DivisionManagement';
import { StationManagement } from '@/components/admin/StationManagement';
import { AdminRoleManagement } from '@/components/admin/AdminRoleManagement';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalZones: 0,
    totalDivisions: 0,
    totalStations: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [zones, divisions, stations] = await Promise.all([
          supabase.from('zones').select('*', { count: 'exact', head: true }),
          supabase.from('divisions').select('*', { count: 'exact', head: true }),
          supabase.from('railway_stations').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          totalUsers: 0,
          totalZones: zones.count || 0,
          totalDivisions: divisions.count || 0,
          totalStations: stations.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="responsive-container py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Super Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage railway system administration</p>
          </div>
          <Shield className="w-12 h-12 text-primary" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Zones</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalZones}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Divisions</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDivisions}</div>
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="zones" className="space-y-4">
          <TabsList>
            <TabsTrigger value="zones">Zones</TabsTrigger>
            <TabsTrigger value="divisions">Divisions</TabsTrigger>
            <TabsTrigger value="stations">Stations</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>

          <TabsContent value="zones" className="space-y-4">
            <ZoneManagement />
          </TabsContent>

          <TabsContent value="divisions" className="space-y-4">
            <DivisionManagement />
          </TabsContent>

          <TabsContent value="stations" className="space-y-4">
            <StationManagement />
          </TabsContent>

          <TabsContent value="admins" className="space-y-4">
            <AdminRoleManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
