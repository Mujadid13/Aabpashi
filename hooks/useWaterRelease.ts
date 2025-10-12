"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const useWaterRelease = (
  setIsFetching: (state: boolean) => void,
  setChatbotMessage: (message: string) => void,
  setShowWaterReleasePopup: (state: boolean) => void,
  setSelectedWaterReleaseCanal: (canal: string | null) => void,
  setSelectedFeature: (feature: string | null) => void,
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
    pa: {
      Kharif: "خریف",
      Rabi: "ربیع",
    },
    sd: {
      Kharif: "خريف",
      Rabi: "رابي",
    },
  };

  const season = getCurrentSeason();
  const localizedSeason = seasonLabels[locale][season]; 
  

  /** ✅ Function to handle submitting selected water release canal */
  const handleSubmitWaterRelease = async (
    selectedWaterReleaseCanal: string | null
  ) => {
    try {
      if (!selectedWaterReleaseCanal) {
        throw new Error("No canal selected.");
      }

      setFetching(true);
      setIsFetching(true);

      const requestBody = {
        canal: selectedWaterReleaseCanal,
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


      const canalMap =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("canalMap") || "{}")
          : {};
      const canalName =
        locale === "ur" && canalMap[result.canal]
          ? canalMap[result.canal]
          : result.canal;

      let message = `📢 ${t("notificationTitle")}\n\n`;

      // Check if the availability data exists and is not empty
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
            canal: canalName,
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
        message += `${t("closedHeader", { canal: canalName })}\n`;
        message += `🚫 ${t("closedWarning", { season: localizedSeason })}\n\n`;
        message += `   - ${t("closedDetails", { canal: canalName, season: localizedSeason })}\n`;
        message += `   - ${t("expectedOpeningDate")}\n`;
        message += `   - ${t("checkBackLater")}\n\n`;
      }

      setChatbotMessage(message);

      // Reset UI states after submission
      setShowWaterReleasePopup(false);
      setSelectedWaterReleaseCanal(null);
      setSelectedFeature(null);
    } catch (error) {
      console.error("Error submitting canal to API:", error);
    } finally {
      setFetching(false);
      setIsFetching(false);
    }
  };

  return {
    isFetching,
    handleSubmitWaterRelease,
  };
};

export default useWaterRelease;
