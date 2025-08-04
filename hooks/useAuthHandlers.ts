"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useManualLoader } from "@/context/ManualLoaderContext"; // ✅ import

export function useAuthHandlers() {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const [userId, setuserId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);

  const { showLoader } = useManualLoader();
  

  useEffect(() => {
    if (typeof document !== "undefined") {
      const metaToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("meta_token="))
        ?.split("=")[1];

      if (metaToken) {
        try {
          const decoded: { userId?: string } = jwtDecode(metaToken);
          setuserId(decoded.userId || null);
        } catch (error) {
          console.error("Failed to decode userId from meta_token", error);
          setuserId(null);
        }
      }
    }
  }, []);

  const handleLogout = async () => {
    showLoader(); // ✅ Show the loader immediately
  
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Ensures cookies are sent
      });
  
      if (!response.ok) {
        console.error("Logout failed:", response.statusText);
        return;
      }
  
      setuserId(null);
      localStorage.removeItem("selectedCanal");
      localStorage.removeItem("canalTranslations");
      localStorage.removeItem("canalMap");
      router.push("/"); 
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleLogin = () => {
    showLoader();                     
    setShowPopup(false);             
  
    router.push("/login?tab=login");
  };
  
  const handleRegister = () => {
    showLoader();                     
    setShowPopup(false);             
  
    router.push("/login?tab=register");
  };

  const handleCancel = () => setShowPopup(false);

  return {
    showPopup,
    setShowPopup,
    handleLogin,
    handleLogout,
    handleRegister,
    handleCancel,
    userId,
    videoRef,
    shouldPlayVideo,
    setShouldPlayVideo,
  };
}
