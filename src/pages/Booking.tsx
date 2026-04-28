import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, CreditCard, Phone, Mail, Calendar, Users, MapPin, Clock, Train } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { initializeRazorpayPayment } from '@/utils/payment';


const idTypes = [
  { value: 'aadhaar', label: 'Aadhaar Card', format: 'XXXX XXXX XXXX' },
  { value: 'pan', label: 'PAN Card', format: 'XXXXX0000X' },
  { value: 'voter_id', label: 'Voter ID', format: 'XXX0000000' },
  { value: 'driving_license', label: 'Driving License', format: 'XX00000000000' },
  { value: 'passport', label: 'Passport', format: 'X0000000' }
];

const bookingSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email address'),
  age: z.string().min(1, 'Age is required'),
  gender: z.enum(['male', 'female', 'other']),
  idType: z.enum(['aadhaar', 'pan', 'voter_id', 'driving_license', 'passport']),
  idNumber: z.string().min(5, 'Please enter a valid ID number'),
  coachClass: z.enum(['sleeper', '3ac', '2ac', '1ac', 'cc', 'ec']),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  
  const { route, searchData, price } = location.state || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      coachClass: 'sleeper',
      gender: 'male',
      idType: 'aadhaar'
    }
  });

  const selectedIdType = watch('idType');

  useEffect(() => {
    if (!route || !searchData) {
      navigate('/');
      return;
    }

    // Load user profile if logged in
    const loadUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
          // Pre-fill form with saved data
          if (profile.full_name) setValue('fullName', profile.full_name);
          if (profile.phone_number) setValue('phone', profile.phone_number);
          if (profile.preferred_class) {
            const classMap: Record<string, any> = {
              'sleeper': 'sleeper',
              '3ac': '3ac',
              '2ac': '2ac',
              '1ac': '1ac',
              'cc': 'cc',
              'ec': 'ec'
            };
            setValue('coachClass', classMap[profile.preferred_class] || 'sleeper');
          }
        }
      }
    };

    loadUserProfile();
  }, [route, searchData, navigate, setValue]);

  // Helper function to generate coach and seat numbers
  const generateCoachAndSeat = (coachClass: string) => {
    const coachPrefixes: Record<string, string> = {
      'sleeper': 'S',
      '3ac': 'B',
      '2ac': 'A',
      '1ac': 'H',
      'cc': 'C',
      'ec': 'E'
    };
    
    const prefix = coachPrefixes[coachClass] || 'S';
    const coachNumber = Math.floor(Math.random() * 10) + 1;
    const seatNumber = Math.floor(Math.random() * 72) + 1;
    
    return {
      coach_no: `${prefix}${coachNumber}`,
      seat_no: `${seatNumber}`,
      seat_type: coachClass === 'sleeper' ? 'SL' : 
                 coachClass === '3ac' ? 'LB' :
                 coachClass === '2ac' ? 'LB' :
                 coachClass === '1ac' ? 'LB' :
                 coachClass === 'cc' ? 'SS' : 'SS'
    };
  };

  const onSubmit = async (data: BookingFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to complete your booking.",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      // 1. Create Order via Supabase Edge Function
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { 
          amount: price * parseInt(searchData.passengers) * 100,
          currency: 'INR'
        }
      });

      if (orderError) {
        console.error('Edge function invocation failed:', orderError);
        throw new Error(`Edge Function Error: ${orderError.message}`);
      }
      
      if (!orderData?.id) {
        console.error('Missing order ID in response:', orderData);
        throw new Error(orderData?.error || 'Failed to create secure payment order');
      }

      // 2. Initialise Razorpay payment
      const checkoutOptions: any = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_N9XvE3uR1wH8l2', // Fallback to test key
        amount: orderData.amount, // Amount from the server
        currency: orderData.currency,
        name: 'SplitNGo',
        description: `Booking for Train ${route.trainId} - ${route.trainName}`,
        image: '/SplitNGo.png',
        order_id: orderData.id, // The securely generated Order ID
        handler: async (response: any) => {
          // This code runs AFTER successful payment
          try {
            setLoading(true);
            const paymentId = response.razorpay_payment_id;
            const orderId = response.razorpay_order_id;
            const signature = response.razorpay_signature;

            // Generate booking reference
            const bookingRef = `SNG${Date.now().toString(36).toUpperCase()}`;
            
            // Generate coach and seat numbers
            const seatDetails = generateCoachAndSeat(data.coachClass);

            // Prepare booking data
            const bookingData = {
              user_id: user.id,
              booking_reference: bookingRef,
              payment_id: paymentId,
              payment_status: 'captured',
              from_station: searchData.sourceStation,
              to_station: searchData.destinationStation,
              journey_date: searchData.date,
              departure_time: route.sourceStation?.departure || '00:00',
              arrival_time: route.destinationStation?.arrival || '00:00',
              passenger_count: parseInt(searchData.passengers),
              total_amount: price * parseInt(searchData.passengers),
              coach_class: data.coachClass,
              train_no: route.trainId,
              train_name: route.trainName,
              coach_no: seatDetails.coach_no,
              seat_no: seatDetails.seat_no,
              seat_type: seatDetails.seat_type,
              is_split_journey: route.type === 'layover',
              layover_stations: route.type === 'layover' ? [route.layoverStation] : [],
              primary_id_type: data.idType,
              primary_id_number: data.idNumber,
              passenger_details: {
                primary_passenger: {
                  name: data.fullName,
                  phone: data.phone,
                  email: data.email,
                  age: parseInt(data.age),
                  gender: data.gender
                }
              },
              booking_data: {
                route: route,
                search_data: searchData,
                razorpay_response: response
              }
            };

            const { data: insertedBooking, error: bookingError } = await supabase
              .from('bookings')
              .insert([bookingData])
              .select()
              .single();

            if (bookingError) throw bookingError;

            // Update user profile with booking details
            await supabase
              .from('profiles')
              .upsert({
                user_id: user.id,
                full_name: data.fullName,
                phone_number: data.phone,
                preferred_class: data.coachClass
              });

            setConfirmedBooking(insertedBooking);
            setBookingConfirmed(true);
            
            toast({
              title: "Payment Successful",
              description: "Your journey has been booked.",
            });
          } catch (err: any) {
            console.error('Post-payment error:', err);
            toast({
              title: "Booking Update Failed",
              description: "Payment was successful but booking recording failed. Please contact support.",
              variant: "destructive"
            });
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: data.fullName,
          email: data.email,
          contact: data.phone
        },
        theme: {
          color: '#3b82f6'
        }
      };

      await initializeRazorpayPayment(checkoutOptions);

    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Payment Initialization Failed",
        description: error.message || "There was an error connecting to the payment gateway.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };


  if (!route || !searchData) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getIdFormat = (type: string) => {
    return idTypes.find(id => id.value === type)?.format || '';
  };

  // Booking Confirmation View
  if (bookingConfirmed && confirmedBooking) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-card p-8">
                {/* Success Icon */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
                  <p className="text-muted-foreground">Your ticket has been booked successfully</p>
                </div>

                {/* Booking Reference */}
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
                  <p className="text-2xl font-bold text-primary">{confirmedBooking.booking_reference}</p>
                </div>

                {/* Journey Details */}
                <div className="space-y-4 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Journey Details</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Train Number</p>
                      <p className="font-medium">{confirmedBooking.train_no}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Train Name</p>
                      <p className="font-medium">{confirmedBooking.train_name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className="font-medium">{confirmedBooking.from_station}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">To</p>
                      <p className="font-medium">{confirmedBooking.to_station}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{formatDate(confirmedBooking.journey_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Departure</p>
                      <p className="font-medium">{confirmedBooking.departure_time}</p>
                    </div>
                  </div>
                </div>

                {/* Seat Details */}
                <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-3">Seat Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Coach</p>
                      <p className="text-xl font-bold text-primary">{confirmedBooking.coach_no}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Seat</p>
                      <p className="text-xl font-bold text-primary">{confirmedBooking.seat_no}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="text-xl font-bold text-primary">{confirmedBooking.seat_type}</p>
                    </div>
                  </div>
                </div>

                {/* Passenger Details */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold">Passenger Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{confirmedBooking.passenger_details?.primary_passenger?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="font-medium">{confirmedBooking.passenger_details?.primary_passenger?.age}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium capitalize">{confirmedBooking.passenger_details?.primary_passenger?.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Passengers</p>
                      <p className="font-medium">{confirmedBooking.passenger_count}</p>
                    </div>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount Paid</span>
                    <span className="text-2xl font-bold text-primary">₹{confirmedBooking.total_amount}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button 
                    onClick={() => navigate('/profile')} 
                    className="flex-1 btn-hero"
                  >
                    View My Bookings
                  </Button>
                  <Button 
                    onClick={() => navigate('/')} 
                    variant="outline"
                    className="flex-1"
                  >
                    Book Another Ticket
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-bold">1</span>
              </div>
              <span className="text-muted-foreground">Select Stations</span>
            </div>
            <div className="w-8 h-px bg-muted"></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-bold">2</span>
              </div>
              <span className="text-muted-foreground">View Results</span>
            </div>
            <div className="w-8 h-px bg-primary"></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-bold">3</span>
              </div>
              <span className="text-primary font-medium">Book</span>
            </div>
          </div>

          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="glass-card p-6">
                  <h2 className="text-2xl font-bold mb-6">Passenger Details</h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Personal Information</h3>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            {...register('fullName')}
                            className="w-full"
                            placeholder="Enter your full name"
                          />
                          {errors.fullName && (
                            <p className="text-sm text-destructive">{errors.fullName.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            {...register('phone')}
                            className="w-full"
                            placeholder="Enter your phone number"
                          />
                          {errors.phone && (
                            <p className="text-sm text-destructive">{errors.phone.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            {...register('email')}
                            className="w-full"
                            placeholder="Enter your email"
                          />
                          {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="age">Age *</Label>
                          <Input
                            id="age"
                            type="number"
                            {...register('age')}
                            className="w-full"
                            placeholder="Age"
                            min="1"
                            max="120"
                          />
                          {errors.age && (
                            <p className="text-sm text-destructive">{errors.age.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Gender *</Label>
                          <RadioGroup 
                            defaultValue="male" 
                            onValueChange={(value) => setValue('gender', value as any)}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male">Male</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female">Female</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other">Other</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>

                    {/* ID Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">ID Verification</h3>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>ID Card Type *</Label>
                          <Select onValueChange={(value) => setValue('idType', value as any)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select ID type" />
                            </SelectTrigger>
                            <SelectContent>
                              {idTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="idNumber">ID Number *</Label>
                          <Input
                            id="idNumber"
                            {...register('idNumber')}
                            className="w-full"
                            placeholder={`Format: ${getIdFormat(selectedIdType)}`}
                          />
                          {errors.idNumber && (
                            <p className="text-sm text-destructive">{errors.idNumber.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Travel Preferences */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Travel Preferences</h3>
                      
                      <div className="space-y-2">
                        <Label>Coach Class *</Label>
                        <RadioGroup 
                          defaultValue="sleeper"
                          onValueChange={(value) => setValue('coachClass', value as any)}
                          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                        >
                          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:border-primary transition-colors">
                            <RadioGroupItem value="sleeper" id="sleeper" />
                            <Label htmlFor="sleeper" className="cursor-pointer flex-1">
                              <div className="font-medium">Sleeper</div>
                              <div className="text-xs text-muted-foreground">SL</div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:border-primary transition-colors">
                            <RadioGroupItem value="3ac" id="3ac" />
                            <Label htmlFor="3ac" className="cursor-pointer flex-1">
                              <div className="font-medium">3 Tier AC</div>
                              <div className="text-xs text-muted-foreground">3A</div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:border-primary transition-colors">
                            <RadioGroupItem value="2ac" id="2ac" />
                            <Label htmlFor="2ac" className="cursor-pointer flex-1">
                              <div className="font-medium">2 Tier AC</div>
                              <div className="text-xs text-muted-foreground">2A</div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:border-primary transition-colors">
                            <RadioGroupItem value="1ac" id="1ac" />
                            <Label htmlFor="1ac" className="cursor-pointer flex-1">
                              <div className="font-medium">First AC</div>
                              <div className="text-xs text-muted-foreground">1A</div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:border-primary transition-colors">
                            <RadioGroupItem value="cc" id="cc" />
                            <Label htmlFor="cc" className="cursor-pointer flex-1">
                              <div className="font-medium">Chair Car</div>
                              <div className="text-xs text-muted-foreground">CC</div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:border-primary transition-colors">
                            <RadioGroupItem value="ec" id="ec" />
                            <Label htmlFor="ec" className="cursor-pointer flex-1">
                              <div className="font-medium">AC Chair Car</div>
                              <div className="text-xs text-muted-foreground">EC</div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full btn-hero hover-scale py-3"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Confirm Booking'}
                    </Button>
                  </form>
                </Card>
              </motion.div>
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-4">Journey Summary</h3>
                  
                  <div className="space-y-4">
                    {/* Route Info */}
                    <div className="flex items-center gap-3">
                      <Train className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{route.trainName}</h4>
                        <p className="text-sm text-muted-foreground">Train #{route.trainId}</p>
                      </div>
                    </div>

                    {route.type === 'layover' && (
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 w-full justify-center">
                        Split Journey - Layover via {route.layoverStation}
                      </Badge>
                    )}

                    {/* Journey Details */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="text-sm">From</span>
                        </div>
                        <span className="font-medium">{searchData.sourceStation}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-secondary" />
                          <span className="text-sm">To</span>
                        </div>
                        <span className="font-medium">{searchData.destinationStation}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm">Date</span>
                        </div>
                        <span className="font-medium">{formatDate(searchData.date)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-sm">Passengers</span>
                        </div>
                        <span className="font-medium">{searchData.passengers}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm">Duration</span>
                        </div>
                        <span className="font-medium">{route.duration}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>Total Amount</span>
                        <span className="text-primary">₹{price * parseInt(searchData.passengers)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        ₹{price} × {searchData.passengers} passenger{searchData.passengers !== '1' ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;