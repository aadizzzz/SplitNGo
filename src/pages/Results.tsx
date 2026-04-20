import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Users, Train, Route, Layers, Calendar, Zap, TrendingUp, CheckCircle2, AlertCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ComboboxAutocomplete } from '@/components/ui/combobox-autocomplete';
import { SearchData } from '@/components/SearchForm';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTrainRoutes, RouteResult, Station } from '@/hooks/useTrainRoutes';
import { useStations } from '@/hooks/useStations';
import { motion } from 'framer-motion';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { findRoutes } = useTrainRoutes();
  const { filterStations } = useStations();
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialSearchData = location.state?.searchData as SearchData;
  const [searchData, setSearchData] = useState<SearchData>(initialSearchData);

  useEffect(() => {
    if (!searchData) {
      navigate('/');
      return;
    }

    // Only proceed if we have both source and destination
    if (!searchData.sourceStation || !searchData.destinationStation) {
      setError('Missing source or destination station');
      setLoading(false);
      return;
    }

    const loadRoutes = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching routes for:', searchData.sourceStation, '→', searchData.destinationStation);
        
        const foundRoutes = await findRoutes(searchData.sourceStation, searchData.destinationStation, searchData.preference);
        console.log('Found routes:', foundRoutes);
        
        setRoutes(foundRoutes);
      } catch (err) {
        console.error('Error loading routes:', err);
        setError(err instanceof Error ? err.message : 'Failed to find routes');
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };

    loadRoutes();
  }, [searchData?.sourceStation, searchData?.destinationStation, searchData?.preference, searchData?.date, searchData?.passengers, navigate]);

  const handleSearchUpdate = (field: keyof SearchData, value: string) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  if (!searchData) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getPreferenceText = (preference: string) => {
    switch (preference) {
      case 'full-journey': return 'Full Journey';
      case 'allow-split': return 'Allow Split';
      case 'allow-layover': return 'Allow Layover';
      default: return preference;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
        <Navigation />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-destructive mb-4">Error loading routes: {error}</p>
            <Button onClick={() => navigate('/')}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const getRouteIcon = (type: string) => {
    switch (type) {
      case 'direct': return <Train className="w-5 h-5" />;
      case 'split': return <Zap className="w-5 h-5" />;
      case 'layover': return <Route className="w-5 h-5" />;
      default: return <Train className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'best-seat-chance': return 'Best Seat Chance';
      case 'high-confidence-split': return 'High Confidence Split';
      case 'same-train-segment': return 'Same Train Split';
      case 'cross-train-layover': return 'Cross-Train Layover';
      case 'direct-route': return 'Direct Route';
      case 'low-probability': return 'Low Probability';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'best-seat-chance': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'high-confidence-split': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'same-train-segment': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'cross-train-layover': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'direct-route': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'low-probability': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-muted';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-blue-400';
    if (confidence >= 40) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 70) return <CheckCircle2 className="w-5 h-5 text-green-400" />;
    return <AlertCircle className="w-5 h-5 text-yellow-400" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-bold">1</span>
              </div>
              <span className="text-primary font-medium">Select Stations</span>
            </div>
            <div className="w-8 h-px bg-primary"></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-bold">2</span>
              </div>
              <span className="text-primary font-medium">View Results</span>
            </div>
            <div className="w-8 h-px bg-muted"></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground font-bold">3</span>
              </div>
              <span className="text-muted-foreground">Book</span>
            </div>
          </div>

          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>

          {/* Editable Search Bar */}
          <Card className="glass-card p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Search Criteria</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {/* Source Station */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  From
                </label>
                <ComboboxAutocomplete
                  value={searchData.sourceStation}
                  onSelect={(value) => handleSearchUpdate('sourceStation', value)}
                  filterFunction={filterStations}
                  placeholder="Select source"
                  searchPlaceholder="Search stations..."
                  emptyText="No stations found."
                />
              </div>

              {/* Destination Station */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary" />
                  To
                </label>
                <ComboboxAutocomplete
                  value={searchData.destinationStation}
                  onSelect={(value) => handleSearchUpdate('destinationStation', value)}
                  filterFunction={filterStations}
                  placeholder="Select destination"
                  searchPlaceholder="Search stations..."
                  emptyText="No stations found."
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Date
                </label>
                <Input
                  type="date"
                  value={searchData.date}
                  onChange={(e) => handleSearchUpdate('date', e.target.value)}
                  className="bg-background/50 border-border/40"
                />
              </div>

              {/* Passengers */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Passengers
                </label>
                <Select value={searchData.passengers} onValueChange={(value) => handleSearchUpdate('passengers', value)}>
                  <SelectTrigger className="bg-background/50 border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preference */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" />
                  Preference
                </label>
                <Select value={searchData.preference} onValueChange={(value) => handleSearchUpdate('preference', value)}>
                  <SelectTrigger className="bg-background/50 border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-journey">Full Journey</SelectItem>
                    <SelectItem value="allow-split">Allow Split</SelectItem>
                    <SelectItem value="allow-layover">Allow Layover</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Results Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Available Routes</h1>
            <p className="text-muted-foreground">
              Found {routes.length} route options - sorted by seat confirmation probability
            </p>
          </div>

          {/* Route Options */}
          <div className="space-y-6">
            {routes && routes.length > 0 ? (
              routes.map((route, index) => (
                <motion.div
                  key={`${route.trainId}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Route Info */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            {getRouteIcon(route.type)}
                            <div>
                              <h3 className="font-semibold text-foreground">{route.trainName}</h3>
                              <p className="text-sm text-muted-foreground">Train #{route.trainId}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={getCategoryColor(route.category)}>
                              {getCategoryLabel(route.category)}
                            </Badge>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-background/50">
                              {getConfidenceIcon(route.seatConfidence)}
                              <span className={`text-sm font-semibold ${getConfidenceColor(route.seatConfidence)}`}>
                                {route.seatConfidence}% Seat Confidence
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Reason why this route is recommended */}
                        <div className="mb-4 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
                          <div className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground/90">{route.reason}</p>
                          </div>
                        </div>
                        
                        {route.type === 'direct' ? (
                          <>
                            {/* Direct Route Time and Duration */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-3">
                              <div className="text-center flex-shrink-0">
                                <p className="font-bold text-lg text-foreground">{route.sourceStation.departure}</p>
                                <p className="text-sm text-muted-foreground truncate">{route.sourceStation.station_name}</p>
                              </div>
                              <div className="flex-1 text-center px-2">
                                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                                  <div className="border-t border-dashed border-muted-foreground/30 flex-1 min-w-[20px]"></div>
                                  <Clock className="w-4 h-4 flex-shrink-0" />
                                  <span className="text-sm font-medium whitespace-nowrap">{route.duration}</span>
                                  <div className="border-t border-dashed border-muted-foreground/30 flex-1 min-w-[20px]"></div>
                                  <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></div>
                                </div>
                              </div>
                              <div className="text-center flex-shrink-0">
                                <p className="font-bold text-lg text-foreground">{route.destinationStation.arrival}</p>
                                <p className="text-sm text-muted-foreground truncate">{route.destinationStation.station_name}</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Layover Route Segments */}
                            <div className="space-y-4">
                              {route.segments?.map((segment, segIndex) => (
                                <motion.div
                                  key={segIndex}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 + segIndex * 0.2 }}
                                  className="border-l-2 border-primary/30 pl-4"
                                >
                                  <div className="flex items-center gap-4 mb-2">
                                    <Badge variant="outline" className="text-xs">
                                      Train {segment.trainId}
                                    </Badge>
                                    <span className="text-sm font-medium">{segment.trainName}</span>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                                    <div className="text-center flex-shrink-0">
                                      <p className="font-bold text-foreground">{segment.departure}</p>
                                      <p className="text-xs text-muted-foreground truncate">{segment.from}</p>
                                    </div>
                                    <div className="flex-1 text-center px-2">
                                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></div>
                                        <div className="border-t border-dashed border-muted-foreground/30 flex-1 min-w-[15px]"></div>
                                        <div className="w-1 h-1 bg-secondary rounded-full flex-shrink-0"></div>
                                      </div>
                                    </div>
                                    <div className="text-center flex-shrink-0">
                                      <p className="font-bold text-foreground">{segment.arrival}</p>
                                      <p className="text-xs text-muted-foreground truncate">{segment.to}</p>
                                    </div>
                                  </div>
                                  {segIndex === 0 && route.layoverDuration && (
                                    <div className="mt-2 text-sm text-amber-500">
                                      Layover: {route.layoverDuration} at {route.layoverStation}
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                              <div className="text-sm text-muted-foreground">
                                Total Journey: {route.duration}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Distance */}
                        <div className="mt-4 p-3 bg-background/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            Distance: <span className="font-medium text-foreground">{route.distance} km</span>
                          </p>
                        </div>
                      </div>

                      {/* Price and Action */}
                      <div className="text-center lg:text-right">
                        <div className="mb-4">
                          <p className="text-2xl font-bold text-primary">₹{Math.round(route.distance * 0.5)}</p>
                          <p className="text-sm text-muted-foreground">per person</p>
                        </div>
                        <Button 
                          className="btn-hero w-full lg:w-auto hover-scale"
                          onClick={() => navigate('/booking', { 
                            state: { 
                              route, 
                              searchData,
                              price: Math.round(route.distance * 0.5)
                            } 
                          })}
                        >
                          {route.type === 'layover' ? 'Book Journey' : 'Book Now'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="glass-card p-8 text-center animate-fade-in">
                <div className="mb-4">
                  <Train className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Routes Found</h3>
                  <p className="text-muted-foreground">
                    We couldn't find any direct routes between {searchData.sourceStation} and {searchData.destinationStation}.
                    Please try different stations or check your spelling.
                  </p>
                </div>
                <Button onClick={() => navigate('/')} variant="outline">
                  Modify Search
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Results;