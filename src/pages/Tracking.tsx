import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { MobileLayout } from "@/components/MobileLayout";
import { 
  MapPin, Clock, Calendar, Power, 
  History, Settings, AlertTriangle, Check
} from "lucide-react";
import { toast } from "sonner";

export default function Tracking() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"active" | "paused">("active");
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const hoursElapsed = 3;
  const nextPush = "2:00 PM";

  const handlePauseResume = () => {
    setStatus(status === "active" ? "paused" : "active");
    toast(status === "active" ? "Tracking paused" : "Tracking resumed");
  };

  const handleEndDay = () => {
    setShowEndConfirm(true);
  };

  const confirmEndDay = () => {
    toast.success("Work day ended. See you tomorrow!");
    navigate("/history");
  };

  return (
    <MobileLayout
      showHeader
      headerContent={
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <StatusBadge variant={status} pulse={status === "active"}>
              {status === "active" ? "Tracking Active" : "Paused"}
            </StatusBadge>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate("/history")}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center touch-target"
            >
              <History className="w-5 h-5 text-muted-foreground" />
            </button>
            <button 
              onClick={() => navigate("/settings")}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center touch-target"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      }
    >
      <div className="flex-1 flex flex-col p-4 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="gradient" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Hours Today</p>
                <p className="text-4xl font-bold text-foreground">{hoursElapsed}h</p>
              </div>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                status === "active" ? "gradient-primary animate-pulse-glow" : "bg-muted"
              }`}>
                <Clock className={`w-8 h-8 ${
                  status === "active" ? "text-primary-foreground" : "text-muted-foreground"
                }`} />
              </div>
            </div>

            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(hoursElapsed / 9) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full gradient-primary rounded-full"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">0h</span>
              <span className="text-xs text-muted-foreground">9h target</span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card variant="elevated" className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Next Update</span>
            </div>
            <p className="font-bold text-foreground">{nextPush}</p>
          </Card>

          <Card variant="elevated" className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-info" />
              <span className="text-xs text-muted-foreground">Updates Sent</span>
            </div>
            <p className="font-bold text-foreground">{hoursElapsed}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="elevated" className="p-5">
            <h3 className="font-semibold text-foreground mb-4">Today's Timeline</h3>
            <div className="space-y-4">
              {[
                { time: "9:00 AM", event: "Checked in", status: "done" },
                { time: "10:00 AM", event: "Location update", status: "done" },
                { time: "11:00 AM", event: "Location update", status: "done" },
                { time: "12:00 PM", event: "Location update", status: "done" },
                { time: "1:00 PM", event: "Location update", status: "pending" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.status === "done" ? "bg-success/15" : "bg-muted"
                  }`}>
                    {item.status === "done" ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{item.event}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="flex-1" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <Button 
            variant="secondary" 
            className="w-full" 
            size="lg"
            onClick={handlePauseResume}
          >
            {status === "active" ? "Pause Tracking" : "Resume Tracking"}
          </Button>
          <Button 
            variant="destructive" 
            className="w-full" 
            size="lg"
            onClick={handleEndDay}
          >
            <Power className="w-5 h-5" />
            End Day
          </Button>
        </motion.div>
      </div>

      {showEndConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-6"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
          >
            <Card variant="elevated" className="p-6 max-w-sm space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-warning/15 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7 text-warning" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-bold text-lg text-foreground">End Your Work Day?</h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to stop tracking and end your work day? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  className="flex-1" 
                  onClick={() => setShowEndConfirm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={confirmEndDay}
                >
                  End Day
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </MobileLayout>
  );
}
