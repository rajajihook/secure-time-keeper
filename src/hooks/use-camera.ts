import { useState } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export interface CapturedPhoto {
  base64: string;
  webPath?: string;
}

export function useCamera() {
  const [photo, setPhoto] = useState<CapturedPhoto | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const takePhoto = async (): Promise<CapturedPhoto | null> => {
    setIsCapturing(true);
    setError(null);

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        correctOrientation: true,
        width: 800,
        height: 800,
      });

      const captured: CapturedPhoto = {
        base64: image.base64String || "",
        webPath: image.webPath,
      };

      setPhoto(captured);
      return captured;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to capture photo";
      setError(errorMessage);
      console.error("Camera error:", err);
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
    setError(null);
  };

  const checkPermissions = async () => {
    try {
      const permissions = await Camera.checkPermissions();
      return permissions.camera === "granted";
    } catch {
      return false;
    }
  };

  const requestPermissions = async () => {
    try {
      const permissions = await Camera.requestPermissions();
      return permissions.camera === "granted";
    } catch {
      return false;
    }
  };

  return {
    photo,
    isCapturing,
    error,
    takePhoto,
    clearPhoto,
    checkPermissions,
    requestPermissions,
  };
}
