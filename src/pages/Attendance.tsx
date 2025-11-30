import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { MobileLayout } from "@/components/MobileLayout";
import { Camera, MapPin, Check, RefreshCw, User, Clock, Crosshair } from "lucide-react";
import { toast } from "sonner";

type AttendanceStep = "pre-checkin" | "camera" | "confirm" | "success";

export default function Attendance() {
  const navigate = useNavigate();
  const [step, setStep] = useState<AttendanceStep>("pre-checkin");
  const [locationFixed, setLocationFixed] = useState(true);
  const [photoTaken, setPhotoTaken] = useState(false);

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

  const handleTakePhoto = () => {
    setStep("camera");
  };

  const handleCapturePhoto = () => {
    setPhotoTaken(true);
    setStep("confirm");
    toast.success("Photo captured!");
  };

  const handleRetake = () => {
    setPhotoTaken(false);
    setStep("camera");
  };

  const handleMarkAttendance = () => {
    setStep("success");
    toast.success("Attendance marked successfully!");
  };

  const handleStartDay = () => {
    navigate("/tracking");
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
                    <p className="text-xs text-muted-foreground">123 Office Street, NYC</p>
                  </div>
                </div>
                <StatusBadge variant={locationFixed ? "active" : "error"} pulse={locationFixed}>
                  {locationFixed ? "Fixed" : "Acquiring"}
                </StatusBadge>
              </div>

              <div className="h-32 rounded-xl bg-muted overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center">
                  <div className="text-center">
                    <Crosshair className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Map Preview</p>
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
              disabled={!locationFixed}
            >
              <Camera className="w-5 h-5" />
              Take Photo & Check In
            </Button>
          </motion.div>
        )}

        {step === "camera" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col -m-4"
          >
            <div className="flex-1 bg-foreground/90 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-80 border-4 border-primary/50 rounded-3xl relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-3 py-1 rounded-full">
                    <p className="text-xs font-medium text-primary">Position your face</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <User className="w-24 h-24 text-primary/30" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-0 right-0 px-6 space-y-4">
                <Card className="p-3 bg-background/90 backdrop-blur-sm">
                  <p className="text-xs text-center text-muted-foreground">
                    <span className="text-primary font-medium">Tip:</span> Blink or smile to confirm liveness
                  </p>
                </Card>

                <div className="flex justify-center">
                  <button
                    onClick={handleCapturePhoto}
                    className="w-20 h-20 rounded-full bg-primary-foreground border-4 border-primary flex items-center justify-center shadow-elevated active:scale-95 transition-transform"
                  >
                    <div className="w-16 h-16 rounded-full gradient-primary" />
                  </button>
                </div>
              </div>
            </div>
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
              <div className="aspect-[3/4] bg-muted rounded-xl flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full gradient-primary mx-auto flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Photo Preview</p>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={handleRetake}>
                <RefreshCw className="w-5 h-5" />
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
                <span className="font-semibold text-foreground text-right text-sm">123 Office Street</span>
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
