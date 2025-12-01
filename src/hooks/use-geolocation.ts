import { useState, useEffect, useCallback } from "react";
import { Geolocation, Position } from "@capacitor/geolocation";

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

export function useGeolocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<string | null>(null);

  const getCurrentPosition = useCallback(async (): Promise<LocationData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const position: Position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      };

      setLocation(locationData);
      return locationData;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to get location";
      setError(errorMessage);
      console.error("Geolocation error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startWatching = useCallback(async () => {
    try {
      const id = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (position, err) => {
          if (err) {
            setError(err.message);
            return;
          }
          if (position) {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            });
          }
        }
      );
      setWatchId(id);
    } catch (err: any) {
      setError(err?.message || "Failed to start watching location");
    }
  }, []);

  const stopWatching = useCallback(async () => {
    if (watchId) {
      await Geolocation.clearWatch({ id: watchId });
      setWatchId(null);
    }
  }, [watchId]);

  const checkPermissions = async () => {
    try {
      const permissions = await Geolocation.checkPermissions();
      return permissions.location === "granted";
    } catch {
      return false;
    }
  };

  const requestPermissions = async () => {
    try {
      const permissions = await Geolocation.requestPermissions();
      return permissions.location === "granted";
    } catch {
      return false;
    }
  };

  useEffect(() => {
    return () => {
      if (watchId) {
        Geolocation.clearWatch({ id: watchId });
      }
    };
  }, [watchId]);

  return {
    location,
    isLoading,
    error,
    isWatching: !!watchId,
    getCurrentPosition,
    startWatching,
    stopWatching,
    checkPermissions,
    requestPermissions,
  };
}
