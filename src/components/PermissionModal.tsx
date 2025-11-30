import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, MapPin, X } from "lucide-react";

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
  type: "camera" | "location";
}

const permissionContent = {
  camera: {
    icon: Camera,
    title: "Camera Access Required",
    description: "We use your camera to verify identity for attendance. Photos are stored securely and used only for attendance verification.",
    benefits: [
      "Quick and secure check-in",
      "Face verification for your safety",
      "Photos stored with encryption"
    ]
  },
  location: {
    icon: MapPin,
    title: "Location Access Required",
    description: "We need your location to confirm you're on site and to send hourly location updates while you're working. You may revoke this at any time.",
    benefits: [
      "Verify your work location",
      "Automatic hourly updates",
      "Full control in settings"
    ]
  }
};

export function PermissionModal({ isOpen, onClose, onAllow, type }: PermissionModalProps) {
  const content = permissionContent[type];
  const Icon = content.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/20 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card variant="elevated" className="overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-muted transition-colors touch-target"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-foreground">{content.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {content.description}
                  </p>
                </div>

                <ul className="space-y-3">
                  {content.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex gap-3 pt-2">
                  <Button variant="secondary" className="flex-1" onClick={onClose}>
                    Not Now
                  </Button>
                  <Button className="flex-1" onClick={onAllow}>
                    Allow Access
                  </Button>
                </div>

                <p className="text-2xs text-center text-muted-foreground">
                  You can change this later in your device settings
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
