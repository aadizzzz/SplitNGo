import { useState, useCallback } from 'react';

export interface Station {
  station_code: string;
  station_name: string;
  arrival: string;
  departure: string;
  distance: number;
}

export interface TrainRoute {
  train_name: string;
  route: Station[];
}

export interface TrainRoutes {
  [key: string]: TrainRoute;
}

export const useTrainRoutes = () => {
  const [trainRoutes, setTrainRoutes] = useState<TrainRoutes>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainRoutes = useCallback(async () => {
    if (Object.keys(trainRoutes).length > 0) {
      return trainRoutes; // Return cached data if already loaded
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/train_routes.json');
      if (!response.ok) {
        throw new Error('Failed to fetch train routes');
      }
      const data = await response.json();
      setTrainRoutes(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [trainRoutes]);

  // Find routes between two stations
  const findRoutes = async (sourceStationName: string, destinationStationName: string, allowLayover: boolean = false) => {
    const routesData = await fetchTrainRoutes();
    const foundRoutes: Array<{
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
    }> = [];

    // First, find direct routes
    Object.entries(routesData as TrainRoutes).forEach(([trainId, train]) => {
      const sourceIndex = train.route.findIndex(station => station.station_name === sourceStationName);
      const destIndex = train.route.findIndex(station => station.station_name === destinationStationName);

      if (sourceIndex !== -1 && destIndex !== -1 && sourceIndex < destIndex) {
        const sourceStation = train.route[sourceIndex];
        const destinationStation = train.route[destIndex];
        
        // Calculate duration
        const depTime = sourceStation.departure;
        const arrTime = destinationStation.arrival;
        
        foundRoutes.push({
          trainId,
          trainName: train.train_name,
          sourceStation,
          destinationStation,
          duration: calculateDuration(depTime, arrTime),
          distance: destinationStation.distance - sourceStation.distance,
          type: 'direct'
        });
      }
    });

    // If no direct routes found and layover is allowed, find layover routes
    if (foundRoutes.length === 0 && allowLayover) {
      const layoverRoutes = findLayoverRoutes(routesData as TrainRoutes, sourceStationName, destinationStationName);
      foundRoutes.push(...layoverRoutes);
    }

    // Sort by departure time
    foundRoutes.sort((a, b) => {
      const aTime = a.sourceStation.departure;
      const bTime = b.sourceStation.departure;
      return aTime.localeCompare(bTime);
    });

    return foundRoutes;
  };

  const calculateDuration = (departure: string, arrival: string) => {
    const [depHour, depMin] = departure.split(':').map(Number);
    const [arrHour, arrMin] = arrival.split(':').map(Number);
    
    let depMinutes = depHour * 60 + depMin;
    let arrMinutes = arrHour * 60 + arrMin;
    
    // Handle next day arrival
    if (arrMinutes < depMinutes) {
      arrMinutes += 24 * 60;
    }
    
    const durationMinutes = arrMinutes - depMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  const findLayoverRoutes = (routesData: TrainRoutes, sourceStationName: string, destinationStationName: string) => {
    const layoverRoutes: Array<{
      trainId: string;
      trainName: string;
      sourceStation: Station;
      destinationStation: Station;
      duration: string;
      distance: number;
      type: 'direct' | 'layover';
      segments: Array<{
        trainId: string;
        trainName: string;
        from: string;
        to: string;
        departure: string;
        arrival: string;
        distance: number;
      }>;
      layoverStation: string;
      layoverDuration: string;
    }> = [];

    // Get all stations that can be reached from source
    const intermediateStations = new Set<string>();
    
    Object.entries(routesData).forEach(([trainId, train]) => {
      const sourceIndex = train.route.findIndex(station => station.station_name === sourceStationName);
      if (sourceIndex !== -1) {
        // Add all stations after source as potential intermediate stations
        for (let i = sourceIndex + 1; i < train.route.length; i++) {
          intermediateStations.add(train.route[i].station_name);
        }
      }
    });

    // For each intermediate station, check if we can reach destination
    intermediateStations.forEach(intermediateStation => {
      if (intermediateStation === destinationStationName) return;

      // Find first leg: source to intermediate
      const firstLegRoutes: Array<{
        trainId: string;
        trainName: string;
        sourceStation: Station;
        destinationStation: Station;
      }> = [];

      Object.entries(routesData).forEach(([trainId, train]) => {
        const sourceIndex = train.route.findIndex(station => station.station_name === sourceStationName);
        const intermediateIndex = train.route.findIndex(station => station.station_name === intermediateStation);

        if (sourceIndex !== -1 && intermediateIndex !== -1 && sourceIndex < intermediateIndex) {
          firstLegRoutes.push({
            trainId,
            trainName: train.train_name,
            sourceStation: train.route[sourceIndex],
            destinationStation: train.route[intermediateIndex]
          });
        }
      });

      // Find second leg: intermediate to destination
      firstLegRoutes.forEach(firstLeg => {
        Object.entries(routesData).forEach(([trainId, train]) => {
          const intermediateIndex = train.route.findIndex(station => station.station_name === intermediateStation);
          const destIndex = train.route.findIndex(station => station.station_name === destinationStationName);

          if (intermediateIndex !== -1 && destIndex !== -1 && intermediateIndex < destIndex) {
            const secondLegStart = train.route[intermediateIndex];
            const secondLegEnd = train.route[destIndex];

            // Check if layover time is reasonable (30 min to 4 hours)
            const arrivalTime = firstLeg.destinationStation.arrival;
            const departureTime = secondLegStart.departure;
            
            const layoverMinutes = calculateLayoverMinutes(arrivalTime, departureTime);
            
            if (layoverMinutes >= 30 && layoverMinutes <= 240) { // 30 min to 4 hours
              const totalDuration = calculateTotalDuration(
                firstLeg.sourceStation.departure,
                secondLegEnd.arrival
              );

              const totalDistance = (firstLeg.destinationStation.distance - firstLeg.sourceStation.distance) +
                                  (secondLegEnd.distance - secondLegStart.distance);

              layoverRoutes.push({
                trainId: `${firstLeg.trainId}-${trainId}`,
                trainName: `${firstLeg.trainName} → ${train.train_name}`,
                sourceStation: firstLeg.sourceStation,
                destinationStation: secondLegEnd,
                duration: totalDuration,
                distance: totalDistance,
                type: 'layover',
                segments: [
                  {
                    trainId: firstLeg.trainId,
                    trainName: firstLeg.trainName,
                    from: firstLeg.sourceStation.station_name,
                    to: firstLeg.destinationStation.station_name,
                    departure: firstLeg.sourceStation.departure,
                    arrival: firstLeg.destinationStation.arrival,
                    distance: firstLeg.destinationStation.distance - firstLeg.sourceStation.distance
                  },
                  {
                    trainId: trainId,
                    trainName: train.train_name,
                    from: secondLegStart.station_name,
                    to: secondLegEnd.station_name,
                    departure: secondLegStart.departure,
                    arrival: secondLegEnd.arrival,
                    distance: secondLegEnd.distance - secondLegStart.distance
                  }
                ],
                layoverStation: intermediateStation,
                layoverDuration: `${Math.floor(layoverMinutes / 60)}h ${layoverMinutes % 60}m`
              });
            }
          }
        });
      });
    });

    return layoverRoutes;
  };

  const calculateLayoverMinutes = (arrivalTime: string, departureTime: string) => {
    const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
    const [depHour, depMin] = departureTime.split(':').map(Number);
    
    let arrMinutes = arrHour * 60 + arrMin;
    let depMinutes = depHour * 60 + depMin;
    
    // Handle next day departure
    if (depMinutes < arrMinutes) {
      depMinutes += 24 * 60;
    }
    
    return depMinutes - arrMinutes;
  };

  const calculateTotalDuration = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    
    // Handle next day arrival
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }
    
    const totalMinutes = endMinutes - startMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  return {
    loading,
    error,
    findRoutes
  };
};