import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { MobileLayout } from "@/components/MobileLayout";
import { 
  ArrowLeft, Calendar, Clock, MapPin, 
  Download, Share2, ChevronRight
} from "lucide-react";
import { toast } from "sonner";

const historyData = [
  {
    date: "Today",
    sessions: [
      {
        id: 1,
        checkIn: "9:00 AM",
        checkOut: null,
        location: "123 Office Street",
        hoursWorked: "3h 30m",
        status: "active" as const,
      },
    ],
  },
  {
    date: "Yesterday",
    sessions: [
      {
        id: 2,
        checkIn: "8:45 AM",
        checkOut: "6:15 PM",
        location: "123 Office Street",
        hoursWorked: "9h 30m",
        status: "ended" as const,
      },
    ],
  },
  {
    date: "Dec 27, 2024",
    sessions: [
      {
        id: 3,
        checkIn: "9:15 AM",
        checkOut: "5:45 PM",
        location: "Remote - Home",
        hoursWorked: "8h 30m",
        status: "ended" as const,
      },
    ],
  },
  {
    date: "Dec 26, 2024",
    sessions: [
      {
        id: 4,
        checkIn: "8:30 AM",
        checkOut: "6:00 PM",
        location: "123 Office Street",
        hoursWorked: "9h 30m",
        status: "ended" as const,
      },
    ],
  },
];

export default function History() {
  const navigate = useNavigate();

  const handleExport = () => {
    toast.success("Exporting attendance data...");
  };

  const handleShare = () => {
    toast.success("Preparing to share...");
  };

  return (
    <MobileLayout
      showHeader
      headerContent={
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors touch-target"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-bold text-foreground">Attendance History</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center touch-target"
            >
              <Share2 className="w-5 h-5 text-muted-foreground" />
            </button>
            <button 
              onClick={handleExport}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center touch-target"
            >
              <Download className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      }
    >
      <div className="flex-1 p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="gradient" className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-3xl font-bold text-foreground">38.5h</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Avg. Daily</p>
                <p className="text-xl font-bold text-foreground">7.7h</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="space-y-4">
          {historyData.map((day, dayIndex) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">{day.date}</span>
              </div>

              {day.sessions.map((session) => (
                <Card 
                  key={session.id} 
                  variant="interactive" 
                  className="p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{session.hoursWorked}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.checkIn} - {session.checkOut || "In Progress"}
                        </p>
                      </div>
                    </div>
                    <StatusBadge 
                      variant={session.status} 
                      pulse={session.status === "active"}
                    >
                      {session.status === "active" ? "Active" : "Completed"}
                    </StatusBadge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{session.location}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
