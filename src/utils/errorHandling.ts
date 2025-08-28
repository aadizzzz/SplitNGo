import { useState, useEffect } from "react";

// Error handling utilities for API calls and network requests

export const handleApiError = (status: number) => {
  switch (status) {
    case 500:
      window.location.href = "/500";
      break;
    case 401:
      window.location.href = "/401";
      break;
    case 403:
      window.location.href = "/403";
      break;
    case 408:
      window.location.href = "/408";
      break;
    case 503:
      window.location.href = "/503";
      break;
    default:
      if (status >= 500) {
        window.location.href = "/500";
      }
      break;
  }
};

export const handleNetworkError = () => {
  if (!navigator.onLine) {
    window.location.href = "/offline";
  } else {
    window.location.href = "/500";
  }
};

// Enhanced fetch wrapper with error handling
export const fetchWithErrorHandling = async (
  url: string, 
  options?: RequestInit
): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      handleApiError(response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Network error
      handleNetworkError();
    }
    throw error;
  }
};

// Hook for checking online status
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      window.location.href = "/offline";
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};