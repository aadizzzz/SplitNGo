import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket, Users, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TicketVerification } from '@/components/admin/TicketVerification';
import { DutyLog } from '@/components/admin/DutyLog';

const TTEDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    ticketsVerified: 0,
    currentPassengers: 0,
    hoursOnDuty: 0,
  });
  const [tteInfo, setTteInfo] = useState<any>(null);

  useEffect(() => {
    const fetchTTEInfo = async () => {
      if (!user) return;

      try {
        // Get TTE info
        const { data: tteData, error: tteError } = await supabase
          .from('ttes')
          .select('*, railway_stations(station_code, station_name)')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (tteError) throw tteError;
        setTteInfo(tteData);

        // Get today's bookings count at this station
        const today = new Date().toISOString().split('T')[0];
        const { count } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('from_station', tteData.railway_stations.station_name)
          .eq('journey_date', today);

        setStats({
          ticketsVerified: 0,
          currentPassengers: count || 0,
          hoursOnDuty: 0,
        });
      } catch (error: any) {
        console.error('Error fetching TTE info:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    };

    fetchTTEInfo();
  }, [user, toast]);

  return (
    <div className="responsive-container py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">TTE Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              {tteInfo ? `${tteInfo.tte_code} - ${tteInfo.railway_stations.station_name}` : 'Ticket verification and passenger management'}
            </p>
          </div>
          <Ticket className="w-12 h-12 text-primary" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tickets Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.ticketsVerified}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Passengers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentPassengers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours on Duty</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.hoursOnDuty}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="verification" className="space-y-4">
          <TabsList>
            <TabsTrigger value="verification">Ticket Verification</TabsTrigger>
            <TabsTrigger value="duty">Duty Log</TabsTrigger>
          </TabsList>

          <TabsContent value="verification" className="space-y-4">
            <TicketVerification tteInfo={tteInfo} />
          </TabsContent>

          <TabsContent value="duty" className="space-y-4">
            <DutyLog tteInfo={tteInfo} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TTEDashboard;
