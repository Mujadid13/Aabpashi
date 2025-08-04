"use client";
import HeroSection from "@/components/sections/HeroSection";
import VideoSection from "@/components/sections/VideoSection";
import FeaturesSection from "@/components/sections/FeatureSection";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScreenSection from "@/components/sections/ScreenSection";
import VoiceOfFarmers from "@/components/sections/VoiceOfFarmers";
import IrrigationBazaar from "@/components/IrrigationBazaar";

export default function Home() {
  const {
    showPopup,
    handleLogin,
    handleLogout,
    handleRegister,
    handleCancel,
    setShowPopup,
    userId,
    videoRef,
    shouldPlayVideo,
    setShouldPlayVideo,
  } = useAuthHandlers();

  return (
    <div className="home-container">
      <Header
        userId={userId}
        handleLogout={handleLogout}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleCancel={handleCancel}
      />
      <HeroSection
        videoRef={videoRef}
        shouldPlayVideo={shouldPlayVideo}
        setShouldPlayVideo={setShouldPlayVideo}
        userId={userId}
      />
      <VideoSection />
      <ScreenSection />
      <VoiceOfFarmers />
      <FeaturesSection />
      <IrrigationBazaar />
      <Footer />
    </div>
  );
}
