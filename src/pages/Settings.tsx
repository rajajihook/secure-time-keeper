import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { MobileLayout } from "@/components/MobileLayout";
import { 
  ArrowLeft, User, Bell, MapPin, Camera, 
  Shield, Trash2, LogOut, ChevronRight,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const navigate = useNavigate();
  const [backgroundTracking, setBackgroundTracking] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleDeletePhotos = () => {
    toast.success("Photo deletion request submitted");
  };

  const settingSections = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Profile",
          description: "John Doe • john@company.com",
          action: "navigate",
        },
      ],
    },
    {
      title: "Privacy & Permissions",
      items: [
        {
          icon: Camera,
          label: "Camera Access",
          description: "Granted",
          action: "navigate",
          color: "success",
        },
        {
          icon: MapPin,
          label: "Location Access",
          description: "Always allowed",
          action: "navigate",
          color: "success",
        },
        {
          icon: Bell,
          label: "Notifications",
          description: "Enabled",
          action: "toggle",
          value: notifications,
          onChange: setNotifications,
        },
      ],
    },
    {
      title: "Tracking",
      items: [
        {
          icon: MapPin,
          label: "Background Tracking",
          description: "Send location updates while app is closed",
          action: "toggle",
          value: backgroundTracking,
          onChange: setBackgroundTracking,
        },
      ],
    },
    {
      title: "Data & Privacy",
      items: [
        {
          icon: Shield,
          label: "Privacy Policy",
          description: "View our data practices",
          action: "link",
        },
        {
          icon: Trash2,
          label: "Delete My Photos",
          description: "Remove all attendance photos",
          action: "danger",
          onClick: handleDeletePhotos,
        },
      ],
    },
  ];

  return (
    <MobileLayout
      showHeader
      headerContent={
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors touch-target"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-bold text-foreground">Settings</h1>
        </div>
      }
    >
      <div className="flex-1 p-4 space-y-6">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              {section.title}
            </h2>
            <Card variant="elevated" className="overflow-hidden divide-y divide-border">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`flex items-center gap-4 p-4 ${
                      item.action === "navigate" || item.action === "link" || item.action === "danger"
                        ? "cursor-pointer hover:bg-muted/50 transition-colors"
                        : ""
                    }`}
                    onClick={item.onClick}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.action === "danger" 
                        ? "bg-destructive/10" 
                        : item.color === "success"
                        ? "bg-success/10"
                        : "bg-primary/10"
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        item.action === "danger"
                          ? "text-destructive"
                          : item.color === "success"
                          ? "text-success"
                          : "text-primary"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${
                        item.action === "danger" ? "text-destructive" : "text-foreground"
                      }`}>
                        {item.label}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.description}
                      </p>
                    </div>
                    {item.action === "toggle" && (
                      <Switch
                        checked={item.value}
                        onCheckedChange={item.onChange}
                      />
                    )}
                    {item.action === "navigate" && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    {item.action === "link" && (
                      <ExternalLink className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </Card>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-4"
        >
          <Button
            variant="outline"
            className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
            size="lg"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </Button>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground pb-4">
          Attendify v1.0.0
        </p>
      </div>
    </MobileLayout>
  );
}
