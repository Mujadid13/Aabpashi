import React from "react";
import { useTranslations } from "next-intl";

interface LocationErrorPopupProps {
  permissionDenied: boolean;
  fetchUserLocation: () => void;
  setLocationError: (error: string) => void;
  locationerror: string;
  
}

const LocationErrorPopup: React.FC<LocationErrorPopupProps> = ({
  permissionDenied,
  locationerror,
}) => {
  const t = useTranslations("locationError");

  if (!permissionDenied) return null;

  return (
    <div className="location-error-popup">
      <p>
        <strong>{t("error")}:</strong> {locationerror}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="try-again-button"
      >
        {t("tryAgain")}
      </button>
    </div>
  );
};

export default LocationErrorPopup;
