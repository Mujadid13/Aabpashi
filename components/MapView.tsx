import React, { useCallback, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  FeatureGroup,
  Circle,
  useMap,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import proj4 from "proj4";
import L from "leaflet";
import { useTranslations } from "next-intl";

// Fix Leaflet icons for markers
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapViewProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number] | null) => void;
  accuracy: number | null;
  selectedFeature: string | null;
  selectedField: any | null;
  isNewUser: boolean;
  tileLayerUrl: string | null;
  polygonCoordinates: any;
  setPolygonCoordinates: (state: any | null) => void;
  loading: boolean;
  error: string | null;
  geoJsonData: any;
  loadingGeoJSON: boolean;
  geoJsonError: string | null;
  setLoadingGeoJSON: (state: boolean) => void;
  setGeoJsonData: (data: any) => void;
  setGeoJsonError: (error: string | null) => void;
  zoom: number;
  division1: string | null;
  setTileLayerUrl: (url: string | null) => void;
  setLoading: (state: boolean) => void;
  setSelectedFeature: (feature: string | null) => void;
  setDrawPolygonMode: (state: boolean) => void;
  drawPolygonMode: boolean;
  AutdrawPolygonMode: boolean;
  setAutDrawPolygonMode: (state: boolean) => void;
  showFieldsPopup: boolean;
  loadingForm: boolean;
}

const MapView: React.FC<MapViewProps> = ({
  position,
  setPosition,
  accuracy,
  selectedFeature,
  selectedField,
  isNewUser,
  tileLayerUrl,
  polygonCoordinates,
  setPolygonCoordinates,
  loading,
  error,
  geoJsonData,
  loadingGeoJSON,
  geoJsonError,
  setGeoJsonData,
  setGeoJsonError,
  setLoadingGeoJSON,
  zoom,
  division1,
  setTileLayerUrl,
  setLoading,
  setSelectedFeature,
  setDrawPolygonMode,
  drawPolygonMode,
  AutdrawPolygonMode,
  setAutDrawPolygonMode,
  showFieldsPopup,
  loadingForm,
}) => {
  const [savepolygon, setSavePolygon] = useState(false);
  const t = useTranslations("map");

  useEffect(() => {
  if (!division1) return;

  const geoJsonUrl = `/geojson-files/${division1}.geojson`;

  setLoadingGeoJSON(true);

  fetch(geoJsonUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`GeoJSON not found for division: ${division1}`);
      }
      return response.json();
    })
    .then((data) => {
      const transformedData = {
        ...data,
        features: data.features.map((feature: any) => ({
          ...feature,
          geometry: {
            ...feature.geometry,
            coordinates: feature.geometry.coordinates.map((line: any) =>
              line.map(([x, y]: [number, number]) =>
                proj4("EPSG:32643", "EPSG:4326", [x, y])
              )
            ),
          },
        })),
      };

      setGeoJsonData(transformedData);
    })
    .catch((error) => {
      console.error("❌ Error loading GeoJSON:", error);
      setGeoJsonError("Failed to load canal data.");
    })
    .finally(() => setLoadingGeoJSON(false));
}, [division1, setGeoJsonData, setGeoJsonError, setLoadingGeoJSON]);

  const handleRecenter = () => {
    if (isNewUser || selectedFeature === "Find My Location") {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      });
    } else if (selectedField) {
      setPosition([selectedField.location.lat, selectedField.location.lng]);
    }
  };

  const clearTileLayer = useCallback(() => {
    setTileLayerUrl(null);
    setPolygonCoordinates(null);
  }, [setPolygonCoordinates, setTileLayerUrl]);

  const FlyToLocation: React.FC<{
    position: [number, number];
    zoom: number;
  }> = ({ position, zoom }) => {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.flyTo(position, zoom, { duration: 1.5 });
      }
    }, [position, zoom, map]);

    return null;
  };

  const handleDrawCreate = (e: { layer: any }) => {
    const layer = e.layer;
    const geoJson = layer.toGeoJSON();

    setPolygonCoordinates(geoJson.geometry);

    setSavePolygon(true);
  };

  const fetchFeatureData = useCallback(
    async (feature: string) => {
      try {
        if (!polygonCoordinates) {
          console.error(" No Polygon Data Found! Draw a polygon first.");
          return;
        }

        setLoading(true);

        const response = await fetch("/api/getGEE", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            feature,
            polygon: polygonCoordinates.coordinates,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch feature data.");
        }

        const data = await response.json();

        setTileLayerUrl(data.tileLayerUrl);
      } catch (err: any) {
        console.error("Error fetching feature data:", err.message);
      } finally {
        setLoading(false);
        setDrawPolygonMode(false);
      }
    },
    [polygonCoordinates, setDrawPolygonMode, setLoading, setTileLayerUrl]
  );

  const savePolygonToDatabase = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/updatefield", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fieldId: selectedField._id,
          polygon: polygonCoordinates,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Failed to update polygon: ${data.error}`);
        return;
      }

      setSavePolygon(false);
    } catch (err: any) {
      alert("Something went wrong while saving the polygon.");
    } finally {
      setLoading(false);
      if (polygonCoordinates && selectedFeature) {
        fetchFeatureData(selectedFeature);
      }
    }
  }, [
    selectedField,
    setLoading,
    polygonCoordinates,
    selectedFeature,
    fetchFeatureData,
  ]);

  useEffect(() => {
    if (selectedFeature !== "Water Stress") {
      clearTileLayer();
    }
    if (savepolygon) {
      savePolygonToDatabase();
    }
  }, [clearTileLayer, savePolygonToDatabase, savepolygon, selectedFeature]);

  const FeatureTileLayer = () => {
    const map = useMap();

    useEffect(() => {
      if (!tileLayerUrl) return;

      // ✅ Create a new pane with high zIndex
      if (!map.getPane("topTilePane")) {
        map.createPane("topTilePane");
        map.getPane("topTilePane")!.style.zIndex = "650"; // higher than overlayPane
      }

      const tileLayer = L.tileLayer(tileLayerUrl, {
        pane: "topTilePane", // ✅ use custom pane
        attribution: "Feature Map from Google Earth Engine",
        maxZoom: 18,
        tileSize: 256,
        zoomOffset: 0,
      });

      tileLayer.addTo(map);

      return () => {
        map.removeLayer(tileLayer);
      };
    }, [map]);

    return null;
  };

  const legends: { [key: string]: { colors: string[]; labels: string[] } } = {
    "Water Stress": {
      colors: ["#d7301f", "#fc8d59", "#fdcc8a", "#d9f0a3", "#2c7fb8"],
      labels: [
        "High Stress",
        "Moderate Stress",
        "Low Stress",
        "Slight Stress",
        "No Stress",
      ],
    },
    "Soil Moisture Index": {
      colors: ["#FFFF00", "#ADFF2F", "#008000", "#00BFFF", "#0000FF"],
      labels: ["Very Dry", "Dry", "Optimal Moisture", "Wet", "Very Wet"],
    },
  };

  useEffect(() => {
    if (
      AutdrawPolygonMode &&
      selectedField?.polygon &&
      selectedField.polygon.type === "Polygon"
    ) {
      setPolygonCoordinates(selectedField.polygon);
    }
  }, [AutdrawPolygonMode, selectedField, setPolygonCoordinates]);

  useEffect(() => {
    if (!AutdrawPolygonMode || !polygonCoordinates) return;

    // Trigger fetch only after polygonCoordinates are ready
    if (polygonCoordinates && selectedFeature) {
      fetchFeatureData(selectedFeature);
    }

    // Reset the mode
    setAutDrawPolygonMode(false);
  }, [
    polygonCoordinates,
    AutdrawPolygonMode,
    selectedFeature,
    setAutDrawPolygonMode,
    fetchFeatureData,
  ]);

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3000,
          }}
        >
          <div className="flex flex-col items-center justify-center text-white text-lg font-semibold space-y-4">
            <div className="loading-spinner" />
            <span>{t("loadingFeatureData")}</span>
          </div>
        </div>
      )}

      {/* Show Map if Location Available */}
      <MapContainer
        center={position || [30.3753, 69.3451]}
        zoom={6}
        className="map-container2"
        attributionControl={false}
      >
        <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" />

        {selectedField && (
          <>
            <FlyToLocation
              position={[
                selectedField.location.lat,
                selectedField.location.lng,
              ]}
              zoom={zoom}
            />
            <Marker
              position={[
                selectedField.location.lat,
                selectedField.location.lng,
              ]}
            >
              <Popup>📍 {selectedField.fieldName}</Popup>
            </Marker>
          </>
        )}

        {!position && !loadingForm && !showFieldsPopup && (
          <FlyToLocation position={[30.3753, 69.3451]} zoom={zoom} />
        )}

        {/* Water Canals with Flow Effect */}
        {geoJsonData && (
          <GeoJSON data={geoJsonData} style={{ className: "geojson-flow" }} />
        )}

        {/* Show loading indicator while fetching GeoJSON */}
        {loadingGeoJSON && (
          <div className="loading-indicator-geosjon">
            {t("loadingCanalData")}
          </div>
        )}

        {/* Show error if GeoJSON fails */}
        {geoJsonError && <div className="error-message">{geoJsonError}</div>}

        {/* User Location Marker */}
        {(isNewUser || selectedFeature === "Find My Location") && position && (
          <>
            <Marker position={position}>
              <Popup>{t("youAreHere")}</Popup>
              <FlyToLocation position={position} zoom={zoom} />
            </Marker>

            {accuracy !== null && accuracy > 0 && (
              <Circle
                center={position as [number, number]}
                radius={accuracy}
                pathOptions={{
                  color: "blue",
                  fillColor: "rgba(0, 166, 255, 0.3)",
                  fillOpacity: 0.5,
                }}
              />
            )}

            {loading && accuracy !== null && accuracy > 300 && (
              <div className="overlay-loading">
                <div className="spinner"></div>
                <p>{t("checkAccuracy")}</p>
              </div>
            )}
          </>
        )}

        {drawPolygonMode && (
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handleDrawCreate}
              draw={{
                polygon: true,
                rectangle: false,
                circle: false,
                polyline: false,
                marker: false,
                circlemarker: false,
              }}
              edit={{
                remove: false,
                edit: false,
              }}
            />
          </FeatureGroup>
        )}

        {tileLayerUrl && <FeatureTileLayer />}

        {/* Update Location Button */}
        <button
          onClick={handleRecenter}
          className="recenter-button"
          style={{ zIndex: 1000 }}
        >
          {t("recenter")}
        </button>
      </MapContainer>

      {tileLayerUrl && selectedFeature && legends[selectedFeature] && (
        <div className="legend-card">
          <button
            onClick={() => {
              setTileLayerUrl(null);
              setSelectedFeature(null);
            }}
            className="absolute top-1 right-2 text-white bg-red-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition"
            title="Close Layer"
          >
            ✕
          </button>
          <h4 className="legend-title">
            {t("legendScale", {
              feature: t(`legends.${selectedFeature}.label`, {
                fallback: selectedFeature,
              }),
            })}
          </h4>

          {/* Gradient Bar */}
          <div className="gradient-bar">
            {legends[selectedFeature].colors.map((color, index) => (
              <div
                key={index}
                className="gradient-color"
                style={{ backgroundColor: color }} // Keeping the inline style for dynamic colors
              />
            ))}
          </div>

          {/* Labels Below the Gradient */}
          <div className="legend-labels">
            {legends[selectedFeature].labels.map((label, index) => (
              <span key={index}>
                {t(`legends.${selectedFeature}.${label}`)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Display Error */}
      {error && (
        <div className="error-box" style={{ zIndex: 1000 }}>
          <p>
            <strong>{t("errorPrefix")}</strong> {error}
          </p>
        </div>
      )}
    </>
  );
};

export default MapView;
