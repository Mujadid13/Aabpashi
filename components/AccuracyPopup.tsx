import React from "react";
import { useTranslations } from "next-intl";

interface AccuracyPopupProps {
  accuracy: number | null;
  isNewUser: boolean;
  selectedFeature: string;
}

const AccuracyPopup: React.FC<AccuracyPopupProps> = ({
  accuracy,
  isNewUser,
  selectedFeature,
}) => {
  const t = useTranslations("accuracy");

  const shouldShow =
    accuracy !== null &&
    !isNaN(accuracy) &&
    (isNewUser || selectedFeature === "Find My Location");

  const accuracyClass =
    accuracy !== null
      ? accuracy < 50
        ? "accuracy-good"
        : accuracy < 100
        ? "accuracy-medium"
        : "accuracy-bad"
      : "";

  const accuracyMessage =
    accuracy !== null
      ? accuracy < 50
        ? t("good")
        : accuracy < 100
        ? t("medium")
        : t("bad")
      : "";

  if (!shouldShow) return null;

  return (
    <div className={`accuracy-popup ${accuracyClass}`}>
      📍 {t("label")}: ±{accuracy?.toFixed(2)} {t("meters")}
      <br />
      {accuracyMessage}
    </div>
  );
};

export default AccuracyPopup;
