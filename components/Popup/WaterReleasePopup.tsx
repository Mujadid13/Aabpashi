import React, { useEffect, useState } from "react";
import useWaterRelease from "@/hooks/useWaterRelease";
import { useAudioCue } from "@/context/AudioCueContext";
import { useTranslations, useLocale } from "next-intl";

interface WaterReleasePopupProps {
  showWaterReleasePopup: boolean;
  setShowWaterReleasePopup: (state: boolean) => void;
  selectedWaterReleaseCanal: string | null;
  setSelectedWaterReleaseCanal: (canal: string | null) => void;
  setSelectedFeature: (feature: string | null) => void;
  setShowSearchPopup: (state: boolean) => void;
  nearestCanals: string[];
  isFetching: boolean;
  setIsFetching: (state: boolean) => void;
  setChatbotMessage: (message: string) => void;
  division1: string | null;
}

const WaterReleasePopup: React.FC<WaterReleasePopupProps> = (props) => {
  const t = useTranslations("waterRelease");
  const locale = useLocale();
  const { playAudioCue, stopAudioCue, audioCueEnabled } = useAudioCue();
  const [translatedCanals1, setTranslatedCanals1] = useState<string[]>([]);

  const { isFetching, handleSubmitWaterRelease } = useWaterRelease(
    props.setIsFetching,
    props.setChatbotMessage,
    props.setShowWaterReleasePopup,
    props.setSelectedWaterReleaseCanal,
    props.setSelectedFeature,
    props.division1,
  );

  useEffect(() => {
    if (!props.showWaterReleasePopup || locale !== "ur") {
      setTranslatedCanals1(props.nearestCanals);
      return;
    }

    const translate = async () => {
      const storedMap = JSON.parse(localStorage.getItem("canalMap") || "{}");

      // Check if all canals already have translations
      const allTranslated = props.nearestCanals.every(
        (canal) => storedMap[canal]
      );

      if (allTranslated) {
        const translated = props.nearestCanals.map((canal) => storedMap[canal]);
        setTranslatedCanals1(translated);
        return;
      }

      try {
        const res = await fetch("/api/translatecanal1", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: props.nearestCanals, target: "ur" }),
        });

        const data = await res.json();
        const translated = data.translation || props.nearestCanals;

        // Save new translations to localStorage
        const updatedMap: Record<string, string> = {};
        props.nearestCanals.forEach((canal, index) => {
          updatedMap[canal] = translated[index];
        });

        localStorage.setItem("canalMap", JSON.stringify(updatedMap));
        setTranslatedCanals1(translated);
      } catch {
        setTranslatedCanals1(props.nearestCanals);
      }
    };

    translate();
  }, [props.nearestCanals, props.showWaterReleasePopup, locale]);

  useEffect(() => {
    if (!audioCueEnabled) return;
    if (props.showWaterReleasePopup) {
      playAudioCue("searchByField");
    }
  }, [props.showWaterReleasePopup, audioCueEnabled, playAudioCue]);

  if (!props.showWaterReleasePopup) return null;

  return (
    <div className="water-release-overlay">
      <div className="water-release-container">
        <button
          className="close-button"
          onClick={() => {
            props.setShowWaterReleasePopup(false);
            props.setSelectedWaterReleaseCanal(null);
            props.setSelectedFeature(null);
            stopAudioCue();
          }}
        >
          ✕
        </button>

        <button
          className="back-button"
          onClick={() => {
            props.setShowWaterReleasePopup(false);
            props.setSelectedWaterReleaseCanal(null);
            props.setSelectedFeature(null);
            props.setShowSearchPopup(true);
            stopAudioCue();
          }}
        >
          {t("back")}
        </button>

        <h2 className="popup-title">{t("title")}</h2>

        <div className="canal-options">
          {translatedCanals1.length > 0 ? (
            translatedCanals1.map((canal, index) => (
              <button
                key={index}
                className={`canal-option-button ${
                  props.selectedWaterReleaseCanal === props.nearestCanals[index]
                    ? "selected"
                    : "default"
                }`}
                onClick={() =>
                  props.setSelectedWaterReleaseCanal(props.nearestCanals[index])
                }
              >
                {canal}
              </button>
            ))
          ) : (
            <p className="no-canal-message">{t("noCanals")}</p>
          )}
        </div>

        <button
          className={`submit-button ${
            props.selectedWaterReleaseCanal
              ? isFetching
                ? "disabled"
                : "active"
              : "disabled"
          }`}
          onClick={() =>
            handleSubmitWaterRelease(props.selectedWaterReleaseCanal)
          }
          disabled={!props.selectedWaterReleaseCanal || isFetching}
        >
          {!props.selectedWaterReleaseCanal ? (
            t("selectFirst")
          ) : isFetching ? (
            <span className="flex items-center justify-center w-full">
              {t("fetching")}
              <svg
                className="animate-spin h-5 w-5 ml-2 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </span>
          ) : (
            t("submit")
          )}
        </button>
      </div>
    </div>
  );
};

export default WaterReleasePopup;
