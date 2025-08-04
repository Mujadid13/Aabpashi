"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const useCanalSearch = (
  setIsFetching: (state: boolean) => void,
  setChatbotMessage: (message: string) => void,
  setShowCanalSearchPopup: (state: boolean) => void,
  setSelectedCanalSearch: (canal: string | null) => void,
  setSelectedSearchOption: (option: string | null) => void,
  setSelectedFeature: (feature: string | null) => void,
  setCanalSearchQuery: (query: string) => void,
  division1: string | null,
) => {
  const [isFetching, setFetching] = useState(false);
  const t = useTranslations("messages");
  const locale = useLocale();
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
  const localizedSeason = seasonLabels[locale][season]; 

  const handleSubmitCanal = async (selectedCanalSearch: string | null) => {
    try {
      if (!selectedCanalSearch) {
        throw new Error("No canal selected.");
      }

      if (!division1) {
        throw new Error("No Division Found.");
      }

      setFetching(true);
      setIsFetching(true);

      const canal = selectedCanalSearch.split(",")[0].trim();
      const requestBody = {
        canal,
        division: division1,
      };

      const response = await fetch("/api/getwrs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to send canal to API");
      }

      const result = await response.json();

      const selectedCanalRaw =
        typeof window !== "undefined"
          ? localStorage.getItem("selectedCanal")
          : null;

      const canalTranslations: Record<string, string> =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("canalTranslations") || "{}")
          : {};

      // ✅ Always declare the final display value outside the if
      let selectedCanalDisplay: string = "";

      if (selectedCanalRaw) {
        // Use translated value if available
        const displayValue =
          locale === "ur" && canalTranslations[selectedCanalRaw]
            ? canalTranslations[selectedCanalRaw]
            : selectedCanalRaw;

        // ✅ Trim anything after comma (English or Urdu comma)
        selectedCanalDisplay = displayValue.split(/,|،/)[0].trim();
      }

      // ✅ Now you can use `selectedCanalDisplay` safely below


      let message = `📢 ${t("notificationTitle")}\n\n`;

      if (result.availability && result.availability.length > 0) {
        const availability = result.availability[0];

        let priorityOrSubGroup = "N/A";
        const subPriority = availability["Sub-Group Priority"];
        const groupPriority = availability["Group Priority"];

        if (subPriority && subPriority !== 999) {
          priorityOrSubGroup = subPriority;
        } else {
          priorityOrSubGroup = groupPriority;
        }

        message +=
          t("priorityLevel", {
            canal: selectedCanalDisplay,
            priority: priorityOrSubGroup,
          }) + "\n";

        message += `${t("currentSchedule")}\n`;
        message += `   ✅ ${t("startDate")}: ${
          availability["Start Date"] || "N/A"
        }\n`;
        message += `   ✅ ${t("endDate")}: ${
          availability["End Date"] || "N/A"
        }\n\n`;
        message += `${t("nextSchedule", {
          date: availability["End Date"] || "N/A",
        })}\n\n`;
      } else if (
        result.message &&
        result.message.includes("No Canal found in the Rabi Season")
      ) {
        message += `${t("closedHeader", { canal: selectedCanalDisplay })}\n`;
        message += `🚫 ${t("closedWarning", { season: localizedSeason })}\n\n`;
        message += `   - ${t("closedDetails", { canal: selectedCanalDisplay, season: localizedSeason })}\n`;
        message += `   - ${t("expectedOpeningDate")}\n`;
        message += `   - ${t("checkBackLater")}\n\n`;
      }

      setChatbotMessage(message);

      // Reset UI state
      setShowCanalSearchPopup(false);
      setSelectedCanalSearch(null);
      setSelectedSearchOption(null);
      setSelectedFeature(null);
      setCanalSearchQuery("");
    } catch (error) {
      console.error("Error submitting canal to API:", error);
    } finally {
      setFetching(false);
      setIsFetching(false);
    }
  };

  return {
    isFetching,
    handleSubmitCanal,
  };
};

export default useCanalSearch;
