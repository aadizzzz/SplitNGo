import { useState, useEffect, useMemo } from 'react';

export function useStations() {
  const [stations, setStations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch('/stations.json');
        if (!response.ok) {
          throw new Error('Failed to fetch stations');
        }
        const stationsData = await response.json();
        setStations(stationsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  const filterStations = useMemo(() => {
    return (input: string): Array<{ value: string; label: string }> => {
      const searchTerm = input.trim().toLowerCase();

      if (searchTerm.length === 0) return [];

      let filteredStations: string[];

      if (searchTerm.length <= 2) {
        // First filter only stations that START with those characters
        filteredStations = stations.filter(station =>
          station.toLowerCase().startsWith(searchTerm)
        );
      } else {
        // After 2 letters, include partial matches anywhere in the name
        filteredStations = stations.filter(station =>
          station.toLowerCase().includes(searchTerm)
        );
      }

      return filteredStations.map(station => ({
        value: station,
        label: station
      }));
    };
  }, [stations]);

  return {
    stations,
    loading,
    error,
    filterStations
  };
}