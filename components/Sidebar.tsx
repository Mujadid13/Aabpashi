"use client";
import React from "react";
import features from "@/data/features";

import { Bell } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";

interface SidebarProps {
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
}

const Sidebar: React.FC<SidebarProps> = ({
  accuracy,
  chatbotMessage,
  isAudioPlaying,
  selectedFeature,
  setSelectedFeature,
  setShowFieldsPopup,
  setShowSearchPopup,
  setShowComplaintModal,
  selectedField,
  setChatbotMessage,
  showSearchPopup,
  showComplaintModal,
  position,
  showFieldsPopup,
  setDrawPolygonMode,
  setAutDrawPolygonMode,
}) => {
  
  const {
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
    season,
    seasonLabels,
    locale,
    tSidebar,
    tWeather,
    tWater,
    tChatbot,
    stopAudioCue,
    showLoader,
    router,
    setShowChatPopup,
  } = useSidebar({
    accuracy,
    chatbotMessage,
    isAudioPlaying,
    selectedFeature,
    setSelectedFeature,
    setShowFieldsPopup,
    setShowSearchPopup,
    setShowComplaintModal,
    selectedField,
    setChatbotMessage,
    showSearchPopup,
    showComplaintModal,
    position,
    showFieldsPopup,
    setDrawPolygonMode,
    setAutDrawPolygonMode,
  });

  return (
    <div>
      {/* Sidebar */}
      <aside className="sidebar-container">
        <div className="title-wrapper">
          <h1 className="sidebar-title">{tSidebar("maintitle")}</h1>

          <span className="current-season-badge">
            🌱 {tSidebar("currentSeason")}: {seasonLabels[locale][season]}
          </span>

          <div
            className="notification-icon-wrapper"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="notification-bell" />
            <span className="notification-badge" />
          </div>

          {showNotifications && (
            <div className="notification-dropdown">
              <p className="notification-item">
                📢 {tSidebar("irrigationAlert")}
              </p>
              <p className="notification-item">🌤 {tSidebar("weatherUpdate")}</p>
            </div>
          )}
        </div>

        {/* Add Your Farm Location */}
        <button
          className={`sidebar-button ${
            accuracy === null || accuracy > 300 ? "disabled" : "active"
          }`}
          onClick={() => handleSelection("Add Farm Location")}
          disabled={accuracy === null || accuracy > 300}
        >
          {tSidebar("addFarmLocation")}
        </button>

        {/* Your Fields Button */}
        <button
          className="sidebar-button2"
          onClick={() => setShowFieldsPopup(true)}
        >
          {selectedField
            ? `${tSidebar("selectedField")} - 🌾 ${selectedField.fieldName}`
            : tSidebar("selectYourField")}
        </button>

        {/* Find my Location */}
        <button
          className="sidebar-button2"
          onClick={() => handleSelection("Find My Location")}
        >
          {tSidebar("findMyLocation")}
        </button>

        {/* Features Section */}
        <div className="features-section-sidebar">
          <h2 className="features-title-sidebar">
            {tSidebar("featuresTitle")}
          </h2>
          {features.map((feature: any, index: any) => (
            <button
              key={index}
              className={`feature-button-sidebar ${
                selectedFeature === feature.name ? "selected" : "default"
              } ${
                feature.disabled && feature.disabled(selectedField)
                  ? "disabled"
                  : ""
              }`}
              onClick={() => {
                if (!feature.disabled || !feature.disabled(selectedField)) {
                  feature.action(
                    setSelectedFeature,
                    setShowSearchPopup,
                    setShowComplaintModal
                  );
                }
              }}
              disabled={feature.disabled && feature.disabled(selectedField)}
            >
              {feature.disabled &&
              feature.disabled(selectedField) &&
              selectedField === null
                ? `${feature.label[locale as "en" | "ur" | "pa" | "sd"]} - ⚠ ${tSidebar(
                    "selectFieldWarning"
                  )}`
                : feature.label[locale as "en" | "ur" | "pa" | "sd"]}
            </button>
          ))}
        </div>

        {showWaterStressPopup && selectedField && (
          <div className="water-stress-popup-overlay">
            <div className="water-stress-popup">
              {/* Close Button */}
              <button
                className="water-stress-close-btn"
                onClick={() => {
                  setShowWaterStressPopup(false);
                  setSelectedFeature(null);
                  stopAudioCue();
                }}
                aria-label="Close popup"
              >
                ✕
              </button>

              {/* Header */}
              <h3 className="water-stress-header">
                🌾 <span>{tWater("watertitle")}</span>
              </h3>

              {/* Content */}
              {selectedField.polygon?.coordinates?.[0]?.length > 0 ? (
                <div
                  className="polygon-info-card"
                  onClick={() => {
                    setAutDrawPolygonMode(true);
                    setShowWaterStressPopup(false);
                    stopAudioCue();
                  }}
                >
                  <div className="polygon-info-row">
                    <p className="polygon-label">{tWater("fieldName")}:</p>
                    <p className="polygon-value">{selectedField.fieldName}</p>
                  </div>
                  <div className="polygon-info-row mb-0">
                    <p className="polygon-value">{tWater("fieldArea")}</p>
                    <p className="polygon-subvalue">
                      {tWater("points", {
                        count: selectedField.polygon.coordinates[0].length,
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="no-polygon-msg">
                    {tWater("noPolygonMessage")}
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="add-polygon-btn"
                      onClick={() => {
                        setShowWaterStressPopup(false);
                        setDrawPolygonMode(true);
                        stopAudioCue();
                      }}
                    >
                      <span className="add-polygon-btn-icon">➕</span>{" "}
                      {tWater("addFieldButton")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {showWeatherPopup && weatherData && (
          <div className="weather-popup-overlay">
            <div className="weather-popup-container">
              <h2 className="weather-popup-title">
                {tWeather("weathertitle")}
              </h2>

              <div className="weather-popup-grid">
                {weatherData.time
                  .slice(0, 5)
                  .map((date: string, index: number) => {
                    const rain = weatherData.precipitation_sum[index];
                    const tempMax = weatherData.temperature_2m_max[index];
                    const tempMin = weatherData.temperature_2m_min[index];
                    const humidityMax =
                      weatherData.relative_humidity_2m_max[index];
                    const humidityMin =
                      weatherData.relative_humidity_2m_min[index];

                    let adviceKey = "adviceNormal";
                    if (rain > 2) {
                      adviceKey = "adviceRain";
                    } else if (tempMax > 40) {
                      adviceKey = "adviceHot";
                    } else if (humidityMax > 70) {
                      adviceKey = "adviceHumidity";
                    }

                    return (
                      <div key={index} className="weather-popup-card">
                        <p className="weather-popup-date">
                          {new Date(date).toLocaleDateString(locale, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>

                        <p className="weather-popup-info">
                          {tWeather("rain", { value: rain })}
                        </p>
                        <p className="weather-popup-info">
                          {tWeather("tempMax", { value: tempMax })}
                        </p>
                        <p className="weather-popup-info">
                          {tWeather("tempMin", { value: tempMin })}
                        </p>
                        <p className="weather-popup-info">
                          {tWeather("humidity", {
                            min: humidityMin,
                            max: humidityMax,
                          })}
                        </p>
                        <p className="weather-popup-advice">
                          {tWeather(adviceKey)}
                        </p>
                      </div>
                    );
                  })}
              </div>

              <button
                className="weather-popup-close-btn"
                onClick={() => {
                  setSelectedFeature(null);
                  setShowWeatherPopup(false);
                }}
              >
                {tWeather("close")}
              </button>
            </div>
          </div>
        )}

        {/* Chatbot Window - Hidden in Large Screens if Popup is Open */}
        {!isLargeScreen || !showChatPopup ? (
          <div ref={chatbotRef} className="chatbot-window">
            <h3 className="chatbot-title">{tChatbot("title")}</h3>
            <div className="chatbot-message-container">
              <p className="chatbot-message">
                {chatbotMessage}
                {isAudioPlaying && (
                  <span className="chatbot-audio-indicator">🔊</span>
                )}
              </p>
            </div>
          </div>
        ) : null}

        {/* Back Button */}
        <button
          onClick={() => {
            stopAudioCue();
            showLoader();
            router.push(`/${locale}`);
          }}
          className="back-button-sidebar"
        >
          {tSidebar("back")}
        </button>
      </aside>

      {/* Chatbot Popup on Large Screens */}
      {isLargeScreen && showChatPopup && (
        <div className="chatbot-popup">
          <div className="chatbot-popup-content">
            <h3 className="chatbot-title">{tChatbot("title")}</h3>
            <p className="chatbot-message">
              {chatbotMessage}
              {isAudioPlaying && (
                <span className="chatbot-audio-indicator">🔊</span>
              )}
            </p>
            <button
              className="chatbot-close-button"
              onClick={() => {
                setShowChatPopup(false);
                setChatbotMessage(tSidebar("placeholderMessage"));
              }}
            >
              {tChatbot("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
