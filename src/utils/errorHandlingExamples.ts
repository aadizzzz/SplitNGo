// Example usage in API hooks or components

import { fetchWithErrorHandling, useOnlineStatus } from "@/utils/errorHandling";

// Example: Update useStations hook with error handling
export const useStationsWithErrorHandling = () => {
  const isOnline = useOnlineStatus();
  
  const fetchStations = async () => {
    try {
      const response = await fetchWithErrorHandling("/stations.json");
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch stations:", error);
      throw error;
    }
  };

  // Rest of hook implementation...
};

// Example: API call in component with error handling
export const exampleApiCall = async () => {
  try {
    const response = await fetchWithErrorHandling("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: "example" }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API call failed:", error);
    // Error is already handled by fetchWithErrorHandling
  }
};