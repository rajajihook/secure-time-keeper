import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PermissionModal } from "@/components/PermissionModal";
import { MobileLayout } from "@/components/MobileLayout";
import { Camera, MapPin, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type PermissionStatus = "pending" | "granted" | "denied";

export default function Permissions() {
  const navigate = useNavigate();
  const [cameraPermission, setCameraPermission] = useState<PermissionStatus>("pending");
  const [locationPermission, setLocationPermission] = useState<PermissionStatus>("pending");
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleCameraAllow = () => {
    setCameraPermission("granted");
    setShowCameraModal(false);
    toast.success("Camera access granted");
  };

  const handleLocationAllow = () => {
    setLocationPermission("granted");
    setShowLocationModal(false);
    toast.success("Location access granted");
  };

  const canContinue = cameraPermission === "granted" && locationPermission === "granted";

  const handleContinue = () => {
    if (canContinue) {
      navigate("/attendance");
    }
  };

  const getPermissionIcon = (status: PermissionStatus) => {
    switch (status) {
      case "granted":
        return <Check className="w-5 h-5 text-success" />;
      case "denied":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <MobileLayout className="gradient-hero">
      <div className="flex-1 flex flex-col p-6 safe-top safe-bottom">
        <div className="flex-1 flex flex-col justify-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <h1 className="text-2xl font-bold text-foreground">Required Permissions</h1>
            <p className="text-muted-foreground">
              We need a few permissions to ensure secure and accurate attendance tracking
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <Card
              variant="interactive"
              className={`p-4 ${cameraPermission === "granted" ? "border-success/50" : ""}`}
              onClick={() => cameraPermission === "pending" && setShowCameraModal(true)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  cameraPermission === "granted" ? "bg-success/15" : "bg-primary/10"
                }`}>
                  <Camera className={`w-6 h-6 ${
                    cameraPermission === "granted" ? "text-success" : "text-primary"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">Camera</p>
                    {getPermissionIcon(cameraPermission)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {cameraPermission === "granted" 
                      ? "Access granted" 
                      : "For face verification check-in"
                    }
                  </p>
                </div>
                {cameraPermission === "pending" && (
                  <Button variant="secondary" size="sm">
                    Allow
                  </Button>
                )}
              </div>
            </Card>

            <Card
              variant="interactive"
              className={`p-4 ${locationPermission === "granted" ? "border-success/50" : ""}`}
              onClick={() => locationPermission === "pending" && setShowLocationModal(true)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  locationPermission === "granted" ? "bg-success/15" : "bg-info/10"
                }`}>
                  <MapPin className={`w-6 h-6 ${
                    locationPermission === "granted" ? "text-success" : "text-info"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">Location</p>
                    {getPermissionIcon(locationPermission)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {locationPermission === "granted" 
                      ? "Access granted" 
                      : "For on-site verification & tracking"
                    }
                  </p>
                </div>
                {locationPermission === "pending" && (
                  <Button variant="secondary" size="sm">
                    Allow
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Your privacy matters. All data is encrypted and you can revoke permissions anytime in settings.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            className="w-full"
            size="lg"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            {canContinue ? "Continue to Attendance" : "Grant All Permissions"}
          </Button>
        </motion.div>
      </div>

      <PermissionModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onAllow={handleCameraAllow}
        type="camera"
      />

      <PermissionModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onAllow={handleLocationAllow}
        type="location"
      />
    </MobileLayout>
  );
}
