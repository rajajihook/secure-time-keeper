import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, Shield, Clock, ChevronRight } from "lucide-react";

const slides = [
  {
    icon: Camera,
    title: "Face Check-In",
    description: "Quick and secure attendance with face verification. Just take a selfie to mark your arrival.",
    color: "primary"
  },
  {
    icon: MapPin,
    title: "Location Tracking",
    description: "Automatic GPS tracking while you work. We'll record your location hourly to verify on-site presence.",
    color: "info"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is encrypted and secure. You control when tracking starts and stops. Full transparency always.",
    color: "success"
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/auth");
    }
  };

  const handleSkip = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col p-6 safe-top safe-bottom">
      <div className="flex justify-end">
        <button
          onClick={handleSkip}
          className="text-muted-foreground text-sm font-medium px-4 py-2 touch-target"
        >
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className={`w-28 h-28 mx-auto rounded-3xl flex items-center justify-center shadow-elevated ${
                slides[currentSlide].color === "primary" ? "gradient-primary" :
                slides[currentSlide].color === "info" ? "bg-info" :
                "gradient-success"
              }`}
            >
              {(() => {
                const Icon = slides[currentSlide].icon;
                return <Icon className="w-14 h-14 text-primary-foreground" strokeWidth={1.5} />;
              })()}
            </motion.div>

            <div className="space-y-4 px-4">
              <h2 className="text-2xl font-bold text-foreground">
                {slides[currentSlide].title}
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {slides[currentSlide].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 touch-target ${
                index === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <Button onClick={handleNext} className="w-full" size="lg">
          {currentSlide < slides.length - 1 ? (
            <>
              Next
              <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            "Get Started"
          )}
        </Button>
      </div>
    </div>
  );
}
