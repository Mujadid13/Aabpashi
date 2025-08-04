import { useTranslations } from "next-intl";
import { useState } from "react";

const useSearchMethod = (
  setIsFetchingCanals: (state: boolean) => void,
  setFetchError: (error: string | null) => void,
  setCanalList: (canals: string[]) => void,
  setIsCanalDataFetched: (state: boolean) => void,
  setShowWaterReleasePopup: (state: boolean) => void,
  setNearestCanals: (canals: string[]) => void,
  setChatbotMessage: (message: string) => void,
  setShowSearchPopup: (state: boolean) => void,
  position: [number, number] | null,
  division1: string | null
) => {
  const [isFetching, setIsFetching] = useState(false);
  const t = useTranslations("messages");

  /** ✅ Function to fetch all available canals */
  const fetchCanals = async () => {
    setIsFetchingCanals(true);
    setFetchError(null);

    const requestBody = {
      division: division1,
    };
    
    try {
      const response = await fetch("/api/getcanals", {
        method: "POST", // Change to POST
        headers: {
          "Content-Type": "application/json", // Ensure the server understands the body format
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to fetch canals");

      const data = await response.json();

      // ✅ Convert each object to a formatted string
      const canalDataArray: string[] = Array.from(
        new Set(
          data.flatMap(
            (canal: {
              PARENT_CHA: string;
              CHANNEL_NA: string;
              CIRCLE_NAM: string;
            }) => [
              `${canal.CHANNEL_NA || "Unknown"}, ${
                canal.CIRCLE_NAM || "Unknown"
              }`,
              `${canal.PARENT_CHA || "Unknown"}, ${
                canal.CIRCLE_NAM || "Unknown"
              }`,
            ]
          )
        )
      );

      setCanalList(canalDataArray);
      setIsCanalDataFetched(true);
    } catch (error) {
      console.error("Error fetching canals:", error);
      setFetchError("Failed to load canals. Please try again.");
    } finally {
      setIsFetchingCanals(false);
    }
  };

  /** ✅ Open Canal Search Popup & fetch canals if not already fetched */
  const handleOpenCanalSearchPopup = (
    setShowCanalSearchPopup: (state: boolean) => void,
    isCanalDataFetched: boolean
  ) => {
    setShowCanalSearchPopup(true);
    if (!isCanalDataFetched) {
      fetchCanals();
    }
  };

  /** ✅ Function to fetch nearest canals using position */
  const handleSubmit = async () => {
    try {
      if (!position) {
        throw new Error("Position is not available.");
      }

      if (!position || !division1) {
        throw new Error("Division is not available.");
      }

      setIsFetching(true);

      const requestBody = {
        position: { lon: position[1], lat: position[0] },
        division: division1,
      };

      const uploadResponse = await fetch("/api/getncd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to fetch nearest canals from getNCD");
      }

      const result = await uploadResponse.json();

      if (
        result &&
        Array.isArray(result.nearest_canals) &&
        result.nearest_canals.length > 0
      ) {
        setNearestCanals(result.nearest_canals);
        setShowWaterReleasePopup(true);
      } else {
        let message = result.message;

        if (message?.includes("User is not in the division")) {
          message = `${t("closed")}`;
        }

        setChatbotMessage(message || `${t("noCanalsFound")}`);
      }

      setShowSearchPopup(false);
    } catch (error) {
      console.error("Error submitting position to getNCD:", error);
    } finally {
      setIsFetching(false);
    }
  };

  return {
    isFetching,
    fetchCanals,
    handleOpenCanalSearchPopup,
    handleSubmit,
  };
};

export default useSearchMethod;
