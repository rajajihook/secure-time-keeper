import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { MobileLayout } from "@/components/MobileLayout";
import { Camera, MapPin, Check, RefreshCw, User, Clock, Crosshair, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCamera } from "@/hooks/use-camera";
import { useGeolocation } from "@/hooks/use-geolocation";

type AttendanceStep = "pre-checkin" | "camera" | "confirm" | "success";

export default function Attendance() {
  const navigate = useNavigate();
  const [step, setStep] = useState<AttendanceStep>("pre-checkin");
  
  const { photo, isCapturing, takePhoto, clearPhoto } = useCamera();
  const { location, isLoading: isLocationLoading, getCurrentPosition } = useGeolocation();

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Get location on mount
  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  const locationFixed = !!location;
  const locationAddress = location 
    ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
    : "Acquiring location...";

  const handleTakePhoto = async () => {
    const capturedPhoto = await takePhoto();
    if (capturedPhoto) {
      setStep("confirm");
      toast.success("Photo captured!");
    } else {
      toast.error("Failed to capture photo. Please try again.");
    }
  };

  const handleRetake = () => {
    clearPhoto();
    handleTakePhoto();
  };

  const handleMarkAttendance = () => {
    setStep("success");
    toast.success("Attendance marked successfully!");
  };

  const handleStartDay = () => {
    navigate("/tracking");
  };

  const handleRefreshLocation = () => {
    getCurrentPosition();
    toast("Refreshing location...");
  };

  return (
    <MobileLayout
      showHeader
      headerContent={
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">Good morning</p>
            <h1 className="font-bold text-foreground">John Doe</h1>
          </div>
          <button 
            onClick={() => navigate("/settings")}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center touch-target"
          >
            <User className="w-5 h-5 text-primary" />
          </button>
        </div>
      }
    >
      <div className="flex-1 flex flex-col p-4">
        {step === "pre-checkin" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col space-y-6"
          >
            <Card variant="gradient" className="p-6 text-center">
              <p className="text-muted-foreground text-sm">{currentDate}</p>
              <p className="text-4xl font-bold text-foreground mt-1">{currentTime}</p>
            </Card>

            <Card variant="elevated" className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Location Status</p>
                    <p className="text-xs text-muted-foreground">{locationAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge 
                    variant={isLocationLoading ? "info" : locationFixed ? "active" : "error"} 
                    pulse={isLocationLoading || locationFixed}
                  >
                    {isLocationLoading ? "Acquiring" : locationFixed ? "Fixed" : "No GPS"}
                  </StatusBadge>
                  <button 
                    onClick={handleRefreshLocation}
                    className="p-2 rounded-full hover:bg-muted transition-colors"
                    disabled={isLocationLoading}
                  >
                    <RefreshCw className={`w-4 h-4 text-muted-foreground ${isLocationLoading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              <div className="h-32 rounded-xl bg-muted overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center">
                  <div className="text-center">
                    <Crosshair className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {locationFixed 
                        ? `Accuracy: ${location?.accuracy.toFixed(0)}m` 
                        : "Map Preview"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="elevated" className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center border-2 border-dashed border-border">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Face Verification</p>
                  <p className="text-sm text-muted-foreground">Take a selfie to verify your identity</p>
                </div>
              </div>
            </Card>

            <div className="flex-1" />

            <Button
              className="w-full animate-pulse-glow"
              size="lg"
              onClick={handleTakePhoto}
              disabled={!locationFixed || isCapturing}
            >
              {isCapturing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Opening Camera...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  Take Photo & Check In
                </>
              )}
            </Button>
          </motion.div>
        )}

        {step === "confirm" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-foreground">Confirm Your Photo</h2>
              <p className="text-sm text-muted-foreground">Make sure your face is clearly visible</p>
            </div>

            <Card variant="elevated" className="p-4 overflow-hidden">
              <div className="aspect-[3/4] bg-muted rounded-xl flex items-center justify-center overflow-hidden">
                {photo?.base64 ? (
                  <img 
                    src={`data:image/jpeg;base64,${photo.base64}`} 
                    alt="Captured selfie" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full gradient-primary mx-auto flex items-center justify-center">
                      <User className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">Photo Preview</p>
                  </div>
                )}
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={handleRetake} disabled={isCapturing}>
                {isCapturing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
                Retake
              </Button>
              <Button className="flex-1" onClick={handleMarkAttendance}>
                <Check className="w-5 h-5" />
                Confirm
              </Button>
            </div>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-24 h-24 rounded-full gradient-success flex items-center justify-center shadow-elevated"
            >
              <Check className="w-12 h-12 text-success-foreground" />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Check-In Successful!</h2>
              <p className="text-muted-foreground">Your attendance has been recorded</p>
            </div>

            <Card variant="gradient" className="p-5 w-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Time</span>
                </div>
                <span className="font-semibold text-foreground">{currentTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Location</span>
                </div>
                <span className="font-semibold text-foreground text-right text-sm">
                  {locationAddress}
                </span>
              </div>
            </Card>

            <div className="flex-1" />

            <Button className="w-full" size="lg" onClick={handleStartDay}>
              Start Your Day
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => navigate("/history")}>
              View History
            </Button>
          </motion.div>
        )}
      </div>
    </MobileLayout>
  );
}
