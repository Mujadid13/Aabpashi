import { useCallback } from "react";

interface UseFetchUserLocationProps {
  setPosition: (pos: [number, number] | null) => void;
  setAccuracy: (accuracy: number | null) => void;
  selectedField: any | null;
  setLocationError: (message: string) => void;
  setZoom: (zoom: number) => void;
  setPermissionDenied: (denied: boolean) => void;
  setLoading: (loading: boolean) => void;
}

const useFetchUserLocation = ({
  setPosition,
  setAccuracy,
  selectedField,
  setLocationError,
  setZoom,
  setPermissionDenied,
  setLoading
}: UseFetchUserLocationProps) => {
  const isMobile = () => window.innerWidth <= 768;

  const isTablet = () => window.innerWidth > 768 && window.innerWidth <= 1024;

  const fetchUserLocation = useCallback(
    () => {
      if (!navigator.geolocation) {
        setLocationError("❌ Geolocation is not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (location) => {
          const newPos: [number, number] = [
            location.coords.latitude,
            location.coords.longitude,
          ];
          const accuracy = location.coords.accuracy;

          setPosition(newPos);
          setAccuracy(accuracy);

          setPermissionDenied(false);

          // Adjust zoom based on accuracy and device type
          let zoomLevel;
          if (accuracy < 10) {
            zoomLevel = isMobile() ? 18 : isTablet() ? 17 : 19; // Very high accuracy
          } else if (accuracy < 50) {
            zoomLevel = isMobile() ? 16 : isTablet() ? 15 : 17; // Good accuracy
          } else if (accuracy < 150) {
            zoomLevel = isMobile() ? 14 : isTablet() ? 13 : 16; // Moderate accuracy
          } else {
            zoomLevel = isMobile() ? 12 : isTablet() ? 12 : 17; // Low accuracy (zoom out)
          }

          setZoom(zoomLevel);

          if (accuracy !== null && accuracy < 300) {
            setLoading(false);
          }


          if (!selectedField && accuracy > 300) {
            setTimeout(() => fetchUserLocation(), 2000);
            setLoading(true);
          }
        },
        (error) => {
          setPermissionDenied(true);
          setLocationError(
            "❌ Location access denied. Please allow location permissions."
          );
          
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    },
    [
      setPosition,
      setAccuracy,
      selectedField,
      setLocationError,
      setZoom,
      setPermissionDenied,
      setLoading,
    ]
  );

  return { fetchUserLocation };
};

export default useFetchUserLocation;
