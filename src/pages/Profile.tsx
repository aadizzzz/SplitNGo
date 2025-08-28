import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, BookOpen, Heart, LogOut, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone_number: string | null;
  preferred_class: string;
  layover_tolerance: number;
  notification_preferences: any;
  journey_preferences: any;
}

interface Booking {
  id: string;
  booking_reference: string;
  from_station: string;
  to_station: string;
  journey_date: string;
  departure_time: string;
  arrival_time: string;
  coach_class: string;
  passenger_count: number;
  total_amount: number;
  status: string;
  is_split_journey: boolean;
  layover_stations: string[] | null;
}

const Profile = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: '',
    phone_number: '',
    preferred_class: 'economy',
    layover_tolerance: 60,
  });

  // Redirect if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchBookings();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setEditData({
          full_name: data.full_name || '',
          phone_number: data.phone_number || '',
          preferred_class: data.preferred_class || 'economy',
          layover_tolerance: data.layover_tolerance || 60,
        });
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            user_id: user?.id,
            full_name: user?.user_metadata?.full_name || '',
          }])
          .select()
          .single();

        if (createError) throw createError;
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editData.full_name,
          phone_number: editData.phone_number,
          preferred_class: editData.preferred_class,
          layover_tolerance: editData.layover_tolerance,
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      await fetchProfile();
      setEditing(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-300';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300';
      case 'completed':
        return 'bg-blue-500/20 text-blue-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="responsive-container space-y-6 lg:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 lg:space-y-4"
        >
          <h1 className="text-3xl lg:text-4xl font-bold gradient-text">My Profile</h1>
          <p className="text-muted-foreground text-sm lg:text-base">Manage your account and journey preferences</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Profile Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="glass-card card-hover">
              <CardContent className="p-4 lg:p-6 text-center space-y-4 lg:space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto hover-scale">
                    <User className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-card"></div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg lg:text-xl font-semibold text-foreground line-clamp-1">
                    {profile?.full_name || 'User'}
                  </h3>
                  <p className="text-muted-foreground text-sm truncate">{user?.email}</p>
                </div>
                <Button onClick={signOut} variant="outline" className="w-full btn-animate touch-target">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <Tabs defaultValue="bookings" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                <TabsTrigger value="bookings" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-2 sm:px-4 text-xs sm:text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">My Bookings</span>
                  <span className="sm:hidden">Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-2 sm:px-4 text-xs sm:text-sm">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                  <span className="sm:hidden">Settings</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-2 sm:px-4 text-xs sm:text-sm">
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Preferences</span>
                  <span className="sm:hidden">Prefs</span>
                </TabsTrigger>
              </TabsList>

              {/* Bookings Tab */}
              <TabsContent value="bookings" className="space-y-4 lg:space-y-6 mt-4 lg:mt-6">
                <Card className="glass-card card-hover">
                  <CardHeader className="pb-3 lg:pb-6">
                    <CardTitle className="text-lg lg:text-xl">Recent Bookings</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
                    {bookings.length === 0 ? (
                      <div className="text-center py-6 lg:py-8 space-y-3 lg:space-y-4">
                        <BookOpen className="w-10 h-10 lg:w-12 lg:h-12 text-muted-foreground mx-auto" />
                        <div>
                          <h3 className="text-base lg:text-lg font-semibold text-foreground">No bookings yet</h3>
                          <p className="text-sm lg:text-base text-muted-foreground">Start planning your first journey!</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 lg:space-y-4 max-h-96 overflow-y-auto">
                        {bookings.map((booking) => (
                          <div key={booking.id} className="border border-border rounded-lg p-3 lg:p-4 space-y-3 card-hover">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-foreground text-sm lg:text-base truncate">
                                  {booking.from_station} → {booking.to_station}
                                </h4>
                                <p className="text-xs lg:text-sm text-muted-foreground">
                                  Ref: {booking.booking_reference}
                                </p>
                              </div>
                              <Badge className={`${getStatusColor(booking.status)} text-xs shrink-0`}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
                              <div className="min-w-0">
                                <span className="text-muted-foreground block">Date:</span>
                                <p className="font-medium truncate">
                                  {new Date(booking.journey_date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="min-w-0">
                                <span className="text-muted-foreground block">Time:</span>
                                <p className="font-medium truncate">
                                  {booking.departure_time} - {booking.arrival_time}
                                </p>
                              </div>
                              <div className="min-w-0">
                                <span className="text-muted-foreground block">Class:</span>
                                <p className="font-medium capitalize truncate">{booking.coach_class}</p>
                              </div>
                              <div className="min-w-0">
                                <span className="text-muted-foreground block">Amount:</span>
                                <p className="font-medium truncate">₹{booking.total_amount}</p>
                              </div>
                            </div>
                            {booking.is_split_journey && (
                              <div className="text-xs lg:text-sm">
                                <span className="text-muted-foreground">Split Journey via:</span>
                                <p className="font-medium text-primary truncate">
                                  {booking.layover_stations?.join(', ') || 'Multiple stations'}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Account Settings</CardTitle>
                    {!editing ? (
                      <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button onClick={handleUpdateProfile} size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={() => setEditing(false)} variant="outline" size="sm">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={editing ? editData.full_name : profile?.full_name || ''}
                          onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                          disabled={!editing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={user?.email || ''}
                          disabled
                          className="opacity-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input
                          id="phone_number"
                          value={editing ? editData.phone_number : profile?.phone_number || ''}
                          onChange={(e) => setEditData({ ...editData, phone_number: e.target.value })}
                          disabled={!editing}
                          placeholder="+91 XXXXXXXXXX"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Journey Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferred_class">Preferred Class</Label>
                        <select
                          id="preferred_class"
                          className="w-full p-2 bg-background border border-input rounded-md"
                          value={editing ? editData.preferred_class : profile?.preferred_class || 'economy'}
                          onChange={(e) => setEditData({ ...editData, preferred_class: e.target.value })}
                          disabled={!editing}
                        >
                          <option value="economy">Economy</option>
                          <option value="premium">Premium</option>
                          <option value="business">Business</option>
                          <option value="first">First Class</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="layover_tolerance">Layover Tolerance (minutes)</Label>
                        <Input
                          id="layover_tolerance"
                          type="number"
                          value={editing ? editData.layover_tolerance : profile?.layover_tolerance || 60}
                          onChange={(e) => setEditData({ ...editData, layover_tolerance: parseInt(e.target.value) })}
                          disabled={!editing}
                          min="30"
                          max="480"
                        />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>These preferences will be used as defaults when searching for journeys.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;