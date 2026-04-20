import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, CheckCircle, XCircle, User, Calendar, MapPin, Train } from 'lucide-react';

interface TicketVerificationProps {
  tteInfo: any;
}

interface BookingDetails {
  id: string;
  booking_reference: string;
  from_station: string;
  to_station: string;
  journey_date: string;
  train_no: string;
  train_name: string;
  coach_no: string;
  seat_no: string;
  seat_type: string;
  passenger_count: number;
  status: string;
  passenger_details: any;
}

export const TicketVerification = ({ tteInfo }: TicketVerificationProps) => {
  const [bookingRef, setBookingRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const { toast } = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setBookingDetails(null);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_reference', bookingRef.toUpperCase())
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error('Booking not found');
      }

      setBookingDetails(data);
      
      toast({
        title: 'Booking Found',
        description: `Booking reference: ${data.booking_reference}`,
      });
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      confirmed: 'default',
      pending: 'secondary',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Verify Ticket</CardTitle>
          <CardDescription>Enter booking reference to verify passenger ticket</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="booking_ref">Booking Reference</Label>
              <div className="flex gap-2">
                <Input
                  id="booking_ref"
                  placeholder="e.g., SPLIT123456"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value.toUpperCase())}
                  required
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || !bookingRef}>
                  <Search className="w-4 h-4 mr-2" />
                  Verify
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {bookingDetails && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <CardTitle>Valid Ticket</CardTitle>
                <CardDescription>Booking Reference: {bookingDetails.booking_reference}</CardDescription>
              </div>
            </div>
            {getStatusBadge(bookingDetails.status)}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Train className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Train Details</p>
                    <p className="text-sm text-muted-foreground">
                      {bookingDetails.train_no} - {bookingDetails.train_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Journey</p>
                    <p className="text-sm text-muted-foreground">
                      {bookingDetails.from_station} → {bookingDetails.to_station}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Journey Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(bookingDetails.journey_date).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Passengers</p>
                    <p className="text-sm text-muted-foreground">{bookingDetails.passenger_count} passenger(s)</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Seat Details</p>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Coach: {bookingDetails.coach_no}</p>
                    <p className="text-sm text-muted-foreground">Seat: {bookingDetails.seat_no}</p>
                    <p className="text-sm text-muted-foreground">Type: {bookingDetails.seat_type}</p>
                  </div>
                </div>
              </div>
            </div>

            {bookingDetails.passenger_details && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-3">Passenger Details</p>
                <div className="space-y-2">
                  {Array.isArray(bookingDetails.passenger_details) ? (
                    bookingDetails.passenger_details.map((passenger: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{passenger.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Age: {passenger.age} | Gender: {passenger.gender}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No passenger details available</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};