import React, { useEffect, useRef } from "react";
import useSearchMethod from "@/hooks/useSearchMethod";
import { useAudioCue } from "@/context/AudioCueContext";
import { useTranslations, useLocale } from "next-intl";

interface SearchMethodPopupProps {
  showSearchPopup: boolean;
  setShowSearchPopup: (state: boolean) => void;
  setSelectedSearchOption: (option: string | null) => void;
  selectedSearchOption: string | null;
  selectedField: any | null;
  setIsFetching: (state: boolean) => void;
  setSelectedFeature: (feature: string | null) => void;
  setNearestCanals: (canals: string[]) => void;
  setChatbotMessage: (message: string) => void;
  setShowWaterReleasePopup: (state: boolean) => void;
  position: [number, number] | null;
  setCanalList: (canals: string[]) => void;
  isFetchingCanals: boolean;
  setIsFetchingCanals: (state: boolean) => void;
  setFetchError: (error: string | null) => void;
  isCanalDataFetched: boolean;
  setIsCanalDataFetched: (state: boolean) => void;
  setShowCanalSearchPopup: (state: boolean) => void;
  division1: string | null;
}

const SearchMethodPopup: React.FC<SearchMethodPopupProps> = (props) => {
  const tSearch = useTranslations("searchPopup");
  const locale = useLocale();

  const { audioCueEnabled, playAudioCue, stopAudioCue } = useAudioCue();

  const { isFetching, handleOpenCanalSearchPopup, handleSubmit } =
    useSearchMethod(
      props.setIsFetchingCanals,
      props.setFetchError,
      props.setCanalList,
      props.setIsCanalDataFetched,
      props.setShowWaterReleasePopup,
      props.setNearestCanals,
      props.setChatbotMessage,
      props.setShowSearchPopup,
      props.position,
      props.division1
    );

  useEffect(() => {
    if (!audioCueEnabled) return;

    if (props.showSearchPopup) {
      playAudioCue("searchMethod");
    }
  }, [
    props.showSearchPopup,
    props.selectedField,
    playAudioCue,
    stopAudioCue,
    audioCueEnabled,
  ]);

  if (!props.showSearchPopup) return null;

  return (
    <div className="search-popup-overlay">
      <div className="search-popup-container">
        <button
          className="search-popup-close"
          onClick={() => {
            props.setShowSearchPopup(false);
            props.setSelectedSearchOption(null);
            stopAudioCue();
          }}
        >
          ✕
        </button>

        <h2 className="search-popup-title">{tSearch("title")}</h2>

        <div className="search-popup-options">
          <button
            className={`search-option-button ${
              props.selectedSearchOption === "Search by Canal"
                ? "selected"
                : "default"
            }`}
            onClick={() => {
              props.setSelectedSearchOption("Search by Canal");
              props.setShowSearchPopup(false);
              handleOpenCanalSearchPopup(
                props.setShowCanalSearchPopup,
                props.isCanalDataFetched
              );
            }}
          >
            {tSearch("canal")}
          </button>

          <button
            className={`search-option-button ${
              props.selectedSearchOption === "Search by Field"
                ? "selected"
                : props.selectedField
                ? "default"
                : "disabled"
            }`}
            onClick={() => {
              if (props.selectedField) {
                props.setSelectedSearchOption("Search by Field");
              }
            }}
            disabled={!props.selectedField}
          >
            {!props.selectedField ? tSearch("fieldWarning") : tSearch("field")}
          </button>
        </div>

        <button
          className={`search-submit-button ${
            props.selectedSearchOption
              ? isFetching
                ? "disabled"
                : "active"
              : "disabled"
          }`}
          onClick={() => {
            handleSubmit();
            props.setSelectedSearchOption(null);
            stopAudioCue();
          }}
          disabled={!props.selectedSearchOption || isFetching}
        >
          {isFetching ? (
            <span className="flex items-center justify-center w-full">
              {tSearch("fetching")}
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
            tSearch("submit")
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchMethodPopup;
