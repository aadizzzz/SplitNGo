import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Users, Train, Route, Layers, Calendar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchData } from '@/components/SearchForm';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTrainRoutes, Station } from '@/hooks/useTrainRoutes';
import { motion } from 'framer-motion';

interface RouteResult {
  trainId: string;
  trainName: string;
  sourceStation: Station;
  destinationStation: Station;
  duration: string;
  distance: number;
  type: 'direct' | 'layover';
  segments?: Array<{
    trainId: string;
    trainName: string;
    from: string;
    to: string;
    departure: string;
    arrival: string;
    distance: number;
  }>;
  layoverStation?: string;
  layoverDuration?: string;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { findRoutes } = useTrainRoutes();
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchData = location.state?.searchData as SearchData;

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
        
        const allowLayover = searchData.preference === 'allow-layover';
        const foundRoutes = await findRoutes(searchData.sourceStation, searchData.destinationStation, allowLayover);
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
  }, [searchData?.sourceStation, searchData?.destinationStation, navigate]); // Remove findRoutes from dependencies

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

  const getRouteBadge = (type: string, layoverStation?: string) => {
    switch (type) {
      case 'direct': return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Direct Route</Badge>;
      case 'layover': return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Split Journey - Layover via {layoverStation}</Badge>;
      default: return null;
    }
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

          {/* Search Summary */}
          <Card className="glass-card p-6 mb-8">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-semibold">{searchData.sourceStation}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-semibold">{searchData.destinationStation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{formatDate(searchData.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>{searchData.passengers} {searchData.passengers === '1' ? 'Passenger' : 'Passengers'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Preference:</span>
                <span className="font-medium">{getPreferenceText(searchData.preference)}</span>
              </div>
            </div>
          </Card>

          {/* Results Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Available Routes</h1>
            <p className="text-muted-foreground">
              Found {routes.length} direct route options for your journey
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
                        <div className="flex items-center gap-3 mb-3">
                          {getRouteIcon(route.type)}
                          <div>
                            <h3 className="font-semibold text-foreground">{route.trainName}</h3>
                            <p className="text-sm text-muted-foreground">Train #{route.trainId}</p>
                          </div>
                          {getRouteBadge(route.type, route.layoverStation)}
                        </div>
                        
                        {route.type === 'direct' ? (
                          <>
                            {/* Direct Route Time and Duration */}
                            <div className="flex items-center gap-6 mb-3">
                              <div className="text-center">
                                <p className="font-bold text-lg text-foreground">{route.sourceStation.departure}</p>
                                <p className="text-sm text-muted-foreground">{route.sourceStation.station_name}</p>
                              </div>
                              <div className="flex-1 text-center">
                                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                  <div className="border-t border-dashed border-muted-foreground/30 flex-1"></div>
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm">{route.duration}</span>
                                  <div className="border-t border-dashed border-muted-foreground/30 flex-1"></div>
                                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="font-bold text-lg text-foreground">{route.destinationStation.arrival}</p>
                                <p className="text-sm text-muted-foreground">{route.destinationStation.station_name}</p>
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
                                  <div className="flex items-center gap-6">
                                    <div className="text-center">
                                      <p className="font-bold text-foreground">{segment.departure}</p>
                                      <p className="text-xs text-muted-foreground">{segment.from}</p>
                                    </div>
                                    <div className="flex-1 text-center">
                                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                                        <div className="border-t border-dashed border-muted-foreground/30 flex-1"></div>
                                        <div className="w-1 h-1 bg-secondary rounded-full"></div>
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <p className="font-bold text-foreground">{segment.arrival}</p>
                                      <p className="text-xs text-muted-foreground">{segment.to}</p>
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
                          <p className="text-2xl font-bold text-primary">₹{Math.round(route.distance * 2.5)}</p>
                          <p className="text-sm text-muted-foreground">per person</p>
                        </div>
                        <Button className="btn-hero w-full lg:w-auto hover-scale">
                          {route.type === 'layover' ? 'View Details' : 'Select Route'}
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