import { useState, useEffect, useCallback, useRef } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { toast } from "sonner";

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  sentAt?: number;
}

export interface TrackingState {
  isTracking: boolean;
  isPaused: boolean;
  startTime: number | null;
  updates: LocationUpdate[];
  nextUpdateAt: Date | null;
  hoursElapsed: number;
}

const MAX_TRACKING_HOURS = 9;
const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour in milliseconds

export function useBackgroundTracking() {
  const [state, setState] = useState<TrackingState>({
    isTracking: false,
    isPaused: false,
    startTime: null,
    updates: [],
    nextUpdateAt: null,
    hoursElapsed: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const sendLocationUpdate = useCallback(async (): Promise<LocationUpdate | null> => {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });

      const update: LocationUpdate = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
        sentAt: Date.now(),
      };

      // TODO: Send to backend when Lovable Cloud is enabled
      // await sendToServer(update);
      
      console.log("Location update sent:", update);
      
      setState(prev => ({
        ...prev,
        updates: [...prev.updates, update],
      }));

      return update;
    } catch (error) {
      console.error("Failed to get location for update:", error);
      toast.error("Failed to send location update");
      return null;
    }
  }, []);

  const calculateNextUpdate = useCallback(() => {
    const now = new Date();
    const next = new Date(now.getTime() + UPDATE_INTERVAL_MS);
    return next;
  }, []);

  const updateElapsedTime = useCallback(() => {
    if (startTimeRef.current) {
      const elapsed = (Date.now() - startTimeRef.current) / (1000 * 60 * 60);
      setState(prev => ({
        ...prev,
        hoursElapsed: Math.min(elapsed, MAX_TRACKING_HOURS),
      }));
    }
  }, []);

  const startTracking = useCallback(async () => {
    // Request permissions first
    try {
      const permissions = await Geolocation.requestPermissions();
      if (permissions.location !== "granted") {
        toast.error("Location permission required for tracking");
        return false;
      }
    } catch (error) {
      console.error("Permission error:", error);
      toast.error("Failed to get location permission");
      return false;
    }

    const now = Date.now();
    startTimeRef.current = now;

    // Send initial location update
    await sendLocationUpdate();

    setState(prev => ({
      ...prev,
      isTracking: true,
      isPaused: false,
      startTime: now,
      nextUpdateAt: calculateNextUpdate(),
      hoursElapsed: 0,
    }));

    // Set up hourly interval
    intervalRef.current = setInterval(async () => {
      if (startTimeRef.current) {
        const hoursElapsed = (Date.now() - startTimeRef.current) / (1000 * 60 * 60);
        
        // Auto-stop after max hours
        if (hoursElapsed >= MAX_TRACKING_HOURS) {
          stopTracking();
          toast.info("Tracking automatically stopped after 9 hours");
          return;
        }

        await sendLocationUpdate();
        setState(prev => ({
          ...prev,
          nextUpdateAt: calculateNextUpdate(),
          hoursElapsed: Math.min(hoursElapsed, MAX_TRACKING_HOURS),
        }));
      }
    }, UPDATE_INTERVAL_MS);

    // Update elapsed time every minute for UI
    const elapsedInterval = setInterval(updateElapsedTime, 60000);
    
    // Store the elapsed interval ref (we'll clear it in stopTracking)
    (intervalRef.current as any)._elapsedInterval = elapsedInterval;

    toast.success("Location tracking started");
    return true;
  }, [sendLocationUpdate, calculateNextUpdate, updateElapsedTime]);

  const stopTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      if ((intervalRef.current as any)._elapsedInterval) {
        clearInterval((intervalRef.current as any)._elapsedInterval);
      }
      intervalRef.current = null;
    }
    startTimeRef.current = null;

    setState(prev => ({
      ...prev,
      isTracking: false,
      isPaused: false,
      nextUpdateAt: null,
    }));

    toast.success("Location tracking stopped");
  }, []);

  const pauseTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      if ((intervalRef.current as any)._elapsedInterval) {
        clearInterval((intervalRef.current as any)._elapsedInterval);
      }
      intervalRef.current = null;
    }

    setState(prev => ({
      ...prev,
      isPaused: true,
      nextUpdateAt: null,
    }));

    toast("Tracking paused");
  }, []);

  const resumeTracking = useCallback(async () => {
    // Send immediate update on resume
    await sendLocationUpdate();

    // Restart interval
    intervalRef.current = setInterval(async () => {
      if (startTimeRef.current) {
        const hoursElapsed = (Date.now() - startTimeRef.current) / (1000 * 60 * 60);
        
        if (hoursElapsed >= MAX_TRACKING_HOURS) {
          stopTracking();
          toast.info("Tracking automatically stopped after 9 hours");
          return;
        }

        await sendLocationUpdate();
        setState(prev => ({
          ...prev,
          nextUpdateAt: calculateNextUpdate(),
          hoursElapsed: Math.min(hoursElapsed, MAX_TRACKING_HOURS),
        }));
      }
    }, UPDATE_INTERVAL_MS);

    const elapsedInterval = setInterval(updateElapsedTime, 60000);
    (intervalRef.current as any)._elapsedInterval = elapsedInterval;

    setState(prev => ({
      ...prev,
      isPaused: false,
      nextUpdateAt: calculateNextUpdate(),
    }));

    toast.success("Tracking resumed");
  }, [sendLocationUpdate, calculateNextUpdate, updateElapsedTime, stopTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        if ((intervalRef.current as any)._elapsedInterval) {
          clearInterval((intervalRef.current as any)._elapsedInterval);
        }
      }
    };
  }, []);

  return {
    ...state,
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    sendLocationUpdate,
  };
}
