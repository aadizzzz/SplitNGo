import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar } from 'lucide-react';

interface DutyLogProps {
  tteInfo: any;
}

export const DutyLog = ({ tteInfo }: DutyLogProps) => {
  const today = new Date();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Duty Log</CardTitle>
        <CardDescription>Track your duty hours and activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <Calendar className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm font-medium">Today's Date</p>
            <p className="text-lg font-bold">
              {today.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <Clock className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm font-medium">Duty Status</p>
            <p className="text-lg font-bold text-green-600">Active</p>
          </div>
        </div>

        {tteInfo && (
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">Assigned Station</p>
            <p className="text-lg font-bold">
              {tteInfo.railway_stations.station_code} - {tteInfo.railway_stations.station_name}
            </p>
            <p className="text-sm text-muted-foreground">TTE Code: {tteInfo.tte_code}</p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold">Recent Activities</h3>
          <div className="space-y-2">
            <div className="p-3 border rounded-lg">
              <p className="text-sm font-medium">Duty Started</p>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleTimeString('en-IN')} - Logged in to system
              </p>
            </div>
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No additional activities recorded today</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};