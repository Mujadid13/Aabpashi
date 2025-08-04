// hooks/useSidebar.ts
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAudioCue } from "@/context/AudioCueContext";
import { useManualLoader } from "@/context/ManualLoaderContext";
import { useRouter } from "next/navigation";
import React from "react";

export function useSidebar({
  accuracy,
  chatbotMessage,
  selectedFeature,
  setSelectedFeature,
  selectedField,
  setChatbotMessage,
  showSearchPopup,
  showComplaintModal,
  position,
  showFieldsPopup,
}: {
  accuracy: number | null;
  chatbotMessage: string;
  isAudioPlaying: boolean;
  selectedFeature: string | null;
  setSelectedFeature: (feature: string | null) => void;
  setShowFieldsPopup: (state: boolean) => void;
  setShowSearchPopup: (state: boolean) => void;
  setShowComplaintModal: (state: boolean) => void;
  selectedField?: any;
  setChatbotMessage: (message: string) => void;
  showSearchPopup: boolean;
  showComplaintModal: boolean;
  position: [number, number] | null;
  showFieldsPopup: boolean;
  setDrawPolygonMode: (state: boolean) => void;
  setAutDrawPolygonMode: (state: boolean) => void;
}) {
  const [showWeatherPopup, setShowWeatherPopup] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const { audioCueEnabled, playAudioCue, stopAudioCue } = useAudioCue();

  const router = useRouter();
  const chatbotRef = useRef<HTMLDivElement>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const wasDisabledRef = useRef(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWaterStressPopup, setShowWaterStressPopup] = useState(false);
  const tSidebar = useTranslations("sidebar");
  const tWeather = useTranslations("weatherPopup");
  const tWater = useTranslations("waterStressPopup");
  const tChatbot = useTranslations("chatbot");
  const locale = useLocale();

  const placeholderMessage = tSidebar("placeholderMessage");

  const { showLoader } = useManualLoader();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth > 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (isLargeScreen && chatbotMessage !== placeholderMessage) {
      setShowChatPopup(true);
    }
  }, [chatbotMessage, isLargeScreen, placeholderMessage]);

  useEffect(() => {
    if (chatbotRef.current && chatbotMessage !== placeholderMessage) {
      chatbotRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [chatbotMessage, placeholderMessage]);

  useEffect(() => {
    const isNowEnabled = accuracy !== null && accuracy <= 300;
    if (
      isNowEnabled &&
      wasDisabledRef.current &&
      !selectedField &&
      audioCueEnabled
    ) {
      playAudioCue("addYourFarm");
    }

    if (showFieldsPopup || selectedFeature === "Add Farm Location") {
      stopAudioCue();
    }

    wasDisabledRef.current = !isNowEnabled;
  }, [
    accuracy,
    selectedFeature,
    selectedField,
    showFieldsPopup,
    audioCueEnabled,
    playAudioCue,
    stopAudioCue,
  ]);

  const handleSelection = (feature: string) => {
    if (feature === "Find My Location") {
      stopAudioCue();
    }
    setSelectedFeature(null);
    setTimeout(() => {
      setSelectedFeature(feature);
    }, 0);
  };

  const handleWeatherForecast = React.useCallback(async () => {
    stopAudioCue();

    if (position) {
      try {
        const response = await fetch("/api/getweather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            position: { lat: position[0], lon: position[1] },
          }),
        });

        if (!response.ok) throw new Error("Weather API call failed");
        const data = await response.json();
        setWeatherData(data.daily);
        setShowWeatherPopup(true);
      } catch (error) {
        console.error("Fetch weather error:", error);
        setChatbotMessage("Failed to fetch weather. Please try again.");
      }
    } else {
      setChatbotMessage("No location selected for weather forecast.");
    }
  }, [position, setChatbotMessage, stopAudioCue]);

  useEffect(() => {
    if (selectedFeature == "Weather Forecast") {
      handleWeatherForecast();
    }
  }, [handleWeatherForecast, selectedFeature]);

  // Play when a field is selected
  useEffect(() => {
    if (selectedField && audioCueEnabled) {
      stopAudioCue();
      playAudioCue("fieldSelected");
    }
  }, [selectedField, audioCueEnabled, stopAudioCue, playAudioCue]);

  useEffect(() => {
    if (showSearchPopup) {
      stopAudioCue();
    }
  }, [selectedFeature, showSearchPopup, stopAudioCue]);

  useEffect(() => {
    if (
      selectedFeature === "Water Stress" ||
      selectedFeature === "Weatherforecast"
    ) {
      stopAudioCue();
    }
  }, [selectedFeature, stopAudioCue]);

  useEffect(() => {
    if (showComplaintModal) {
      stopAudioCue();
    }
  }, [showComplaintModal, stopAudioCue]);

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    return month >= 4 && month <= 9 ? "Kharif" : "Rabi";
  };

  const seasonLabels: Record<string, Record<string, string>> = {
    en: {
      Kharif: "Kharif",
      Rabi: "Rabi",
    },
    ur: {
      Kharif: "خریف",
      Rabi: "ربیع",
    },
  };

  const season = getCurrentSeason();

  useEffect(() => {
    if (selectedFeature === "Water Stress") {
      setShowWaterStressPopup(true);
    }

    if (selectedFeature === "Water Stress" && audioCueEnabled) {
      playAudioCue("waterStress");
    }
  }, [audioCueEnabled, playAudioCue, selectedFeature]);

  return {
    isLargeScreen,
    showChatPopup,
    chatbotRef,
    showWeatherPopup,
    weatherData,
    setShowWeatherPopup,
    showWaterStressPopup,
    setShowWaterStressPopup,
    showNotifications,
    setShowNotifications,
    handleSelection,
    handleWeatherForecast,
    season,
    seasonLabels,
    locale,
    tSidebar,
    tWeather,
    tWater,
    tChatbot,
    placeholderMessage,
    audioCueEnabled,
    playAudioCue,
    stopAudioCue,
    showLoader,
    router,
    setShowChatPopup,
  };
}
