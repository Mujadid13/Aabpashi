// components/CanalSearchPopup.tsx
import React, { useEffect, useState } from "react";
import useCanalSearch from "@/hooks/useCanalSearch";
import { useAudioCue } from "@/context/AudioCueContext";
import { useTranslations, useLocale } from "next-intl";

interface Canal {
  name_en: string;
  name_ur: string;
}

interface CanalSearchPopupProps {
  showCanalSearchPopup: boolean;
  setShowCanalSearchPopup: (state: boolean) => void;
  canalSearchQuery: string;
  setCanalSearchQuery: (query: string) => void;
  selectedCanalSearch: string | null;
  setSelectedCanalSearch: (canal: string | null) => void;
  setSelectedSearchOption: (option: string | null) => void;
  setSelectedFeature: (feature: string | null) => void;
  setShowSearchPopup: (state: boolean) => void;
  isFetchingCanals: boolean;
  fetchError: string | null;
  canalList: string[];
  isFetching: boolean;
  setIsFetching: (state: boolean) => void;
  setChatbotMessage: (message: string) => void;
  division1: string | null;
}

const CanalSearchPopup: React.FC<CanalSearchPopupProps> = (props) => {
  const t = useTranslations("canalSearch");
  const locale = useLocale();
  const { audioCueEnabled, playAudioCue, stopAudioCue } = useAudioCue();
  const [translatedCanals, setTranslatedCanals] = useState<Canal[]>([]);

  const { isFetching, handleSubmitCanal } = useCanalSearch(
    props.setIsFetching,
    props.setChatbotMessage,
    props.setShowCanalSearchPopup,
    props.setSelectedCanalSearch,
    props.setSelectedSearchOption,
    props.setSelectedFeature,
    props.setCanalSearchQuery,
    props.division1,
  );

  useEffect(() => {
    if (!props.showCanalSearchPopup) return;

    const translateCanals = async () => {
      try {
        if (locale !== "ur") {
          setTranslatedCanals(
            props.canalList.map((name) => ({
              name_en: name,
              name_ur: name,
            }))
          );
          return;
        }

        const cached = localStorage.getItem("canalTranslations");
        const cachedMap: Record<string, string> = cached
          ? JSON.parse(cached)
          : {};

        const untranslatedCanals = props.canalList.filter(
          (name) => !cachedMap[name]
        );

        if (untranslatedCanals.length > 0) {
          const res = await fetch("/api/translatecanal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: untranslatedCanals, target: "ur" }),
          });

          if (!res.ok) {
            throw new Error(`Translation API failed: ${res.status}`);
          }

          const data = await res.json();

          if (!data.translation || !Array.isArray(data.translation)) {
            throw new Error("Invalid response format from translation API");
          }

          untranslatedCanals.forEach((name, idx) => {
            cachedMap[name] = data.translation[idx] || name;
          });

          localStorage.setItem("canalTranslations", JSON.stringify(cachedMap));
        }

        const final = props.canalList.map((name_en) => ({
          name_en,
          name_ur: cachedMap[name_en] || name_en,
        }));

        setTranslatedCanals(final);
      } catch (error) {
        setTranslatedCanals(
          props.canalList.map((name) => ({
            name_en: name,
            name_ur: name,
          }))
        );
      }
    };

    translateCanals();
  }, [props.canalList, props.showCanalSearchPopup, locale]);

  useEffect(() => {
    if (!audioCueEnabled) return;
    if (props.showCanalSearchPopup) {
      playAudioCue("searchByCanal");
    }
  }, [props.showCanalSearchPopup, audioCueEnabled, playAudioCue]);

  if (!props.showCanalSearchPopup) return null;

  return (
    <div className="canal-search-overlay">
      <div className="canal-search-container">
        <button
          className="close-button"
          onClick={() => {
            props.setShowCanalSearchPopup(false);
            props.setCanalSearchQuery("");
            props.setSelectedCanalSearch(null);
            props.setSelectedSearchOption(null);
            props.setSelectedFeature(null);
            stopAudioCue();
          }}
        >
          ✕
        </button>

        <button
          className="back-button"
          onClick={() => {
            props.setShowCanalSearchPopup(false);
            props.setCanalSearchQuery("");
            props.setSelectedCanalSearch(null);
            props.setSelectedSearchOption(null);
            props.setSelectedFeature(null);
            props.setShowSearchPopup(true);
            stopAudioCue();
          }}
        >
          {t("back")}
        </button>

        <h2 className="popup-title">{t("title")}</h2>

        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={props.canalSearchQuery}
          onChange={(e) => props.setCanalSearchQuery(e.target.value)}
          className="search-input"
        />

        {props.isFetchingCanals ? (
          <p className="loading-message flex items-center justify-center">
            {t("loading")}
            <svg
              className="animate-spin h-5 w-5 ml-2 text-blue-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </p>
        ) : props.fetchError ? (
          <p className="error-message">{t("error")}</p>
        ) : props.canalList.length === 0 ? (
          <p className="no-data-message">{t("noData")}</p>
        ) : translatedCanals.length === 0 ? (
          <p className="no-data-message">{t("translating")}</p>
        ) : (
          <div className="dropdown-list">
            {translatedCanals
              .filter((canal) =>
                canal.name_en
                  .toLowerCase()
                  .includes(props.canalSearchQuery.toLowerCase())
              )
              .map((canal, index) => (
                <button
                  key={index}
                  className={`dropdown-item ${
                    props.selectedCanalSearch === canal.name_en
                      ? "selected"
                      : "default"
                  }`}
                  onClick={() => {
                    props.setSelectedCanalSearch(canal.name_en);
                    localStorage.removeItem("selectedCanal");
                    localStorage.setItem("selectedCanal", canal.name_en);
                  }}
                >
                  {locale === "ur" ? canal.name_ur : canal.name_en}
                </button>
              ))}
          </div>
        )}

        <button
          className={`submit-button ${
            props.selectedCanalSearch
              ? isFetching
                ? "disabled"
                : "active"
              : "disabled"
          }`}
          onClick={() => handleSubmitCanal(props.selectedCanalSearch)}
          disabled={!props.selectedCanalSearch || isFetching}
        >
          {!props.selectedCanalSearch ? (
            t("selectFirst")
          ) : isFetching ? (
            <span className="flex items-center justify-center w-full">
              {t("processing")}
              <svg
                className="animate-spin h-5 w-5 ml-2 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
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

export default CanalSearchPopup;