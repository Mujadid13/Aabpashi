import React, { useCallback, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "chart.js/auto";
import MapView from "@/components/MapView";
import useMAPPAGE from "@/hooks/useMAPPAGE";
import FieldsForm from "@/components/Fields/FieldsForm";
import FieldPopup from "@/components/Fields/FieldPopup";
import ChartsPopup from "@/components/ChartsPopup";
import AccuracyPopup from "@/components/AccuracyPopup";
import LocationErrorPopup from "@/components/LocationErrorPopup";
import useFetchUserLocation from "@/hooks/useFetchUserLocation";
import AudioCueToggle from "@/components/AudioCueToggle";

interface MAPPageProps {
  showFieldsPopup: boolean;
  setShowFieldsPopup: (value: boolean) => void;
  selectedFeature: string | null;
  setSelectedFeature: (feature: string | null) => void;
  position: [number, number] | null;
  setPosition: (pos: [number, number] | null) => void;
  accuracy: number | null;
  setAccuracy: (acc: number | null) => void;
  selectedField: any | null;
  setSelectedField: (field: any | null) => void;
  userId: string | null;
  division1: string | null;
  confirmDelete: {
    show: boolean;
    fieldId: string | null;
    fieldName: string;
  };
  setConfirmDelete: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      fieldId: string | null;
      fieldName: string;
    }>
  >;
  setDrawPolygonMode: (value: boolean) => void;
  drawPolygonMode: boolean;
  setAutDrawPolygonMode: (value: boolean) => void;
  AutdrawPolygonMode: boolean;
}

const MAPPage: React.FC<MAPPageProps> = ({
  showFieldsPopup,
  setShowFieldsPopup,
  selectedFeature,
  setSelectedFeature,
  position,
  setPosition,
  accuracy,
  setAccuracy,
  selectedField,
  setSelectedField,
  userId,
  division1,
  confirmDelete,
  setConfirmDelete,
  setDrawPolygonMode,
  drawPolygonMode,
  setAutDrawPolygonMode,
  AutdrawPolygonMode,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    fieldName: string;
    cropTypes: string[];
    soilType: string;
  }>({
    fieldName: "",
    cropTypes: [],
    soilType: "",
  });

  const state = useMAPPAGE();

  const { fetchUserLocation } = useFetchUserLocation({
    setPosition: setPosition,
    setAccuracy: setAccuracy,
    selectedField: selectedField,
    setLocationError: state.setLocationError,
    setZoom: state.setZoom,
    setPermissionDenied: state.setPermissionDenied,
    setLoading: state.setLoading,
  });

  useEffect(() => {
    if (selectedFeature === "Find My Location") {
      if (selectedField !== null) {
        setSelectedField(null);
      }
      fetchUserLocation();
    } else if (selectedFeature === "Add Farm Location") {
      setShowForm(true);
    } else if (state.isNewUser) {
      fetchUserLocation();
    }
  }, [
    fetchUserLocation,
    selectedFeature,
    selectedField,
    setSelectedField,
    state.isNewUser,
  ]);

  return (
    <div className="map-container2">
      {/* Accuracy */}
      <AccuracyPopup
        accuracy={accuracy}
        isNewUser={state.isNewUser}
        selectedFeature={selectedFeature || ""}
      />

      {/* Your Charts Button */}
      <ChartsPopup
        showPopup={state.showPopup}
        setShowPopup={state.setShowPopup}
        tileLayerUrl={state.tileLayerUrl}
      />

      {/* Fields Form */}
      <FieldsForm
        showForm={showForm}
        setShowForm={setShowForm}
        formData={formData}
        setFormData={setFormData}
        position={position}
        setSelectedFeature={setSelectedFeature}
        setIsNewUser={state.setIsNewUser}
        setAccuracy={setAccuracy}
        setPosition={setPosition}
        userId={userId}
        setFields={state.setFields}
        setLoadingForm={state.setLoadingForm}
        setShowFieldsPopup={setShowFieldsPopup}
        setError={state.setError}
        setSelectedField={setSelectedField}
        setZoom={state.setZoom}
        loadingForm={state.loadingForm}
      />

      {/* Added Your Fields Popup */}
      <FieldPopup
        setShowFieldsPopup={setShowFieldsPopup}
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        setPosition={setPosition}
        fields={state.fields}
        setFields={state.setFields}
        setIsNewUser={state.setIsNewUser}
        setError={state.setError}
        setAccuracy={setAccuracy}
        setSelectedFeature={setSelectedFeature}
        showFieldsPopup={showFieldsPopup}
        userId={userId}
        setZoom={state.setZoom}
        setLoadingForm={state.setLoadingForm}
        loadingForm={state.loadingForm}
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        zoom={state.zoom}
        position={position}
      />

      {/* Show Map if Location Available */}
      <MapView
        position={position}
        setPosition={setPosition}
        accuracy={accuracy}
        selectedFeature={selectedFeature}
        selectedField={selectedField}
        isNewUser={state.isNewUser}
        tileLayerUrl={state.tileLayerUrl}
        polygonCoordinates={state.polygonCoordinates}
        setPolygonCoordinates={state.setPolygonCoordinates}
        loading={state.loading}
        error={state.error}
        geoJsonData={state.geoJsonData}
        loadingGeoJSON={state.loadingGeoJSON}
        geoJsonError={state.geoJsonError}
        setLoadingGeoJSON={state.setLoadingGeoJSON}
        setGeoJsonData={state.setGeoJsonData}
        setGeoJsonError={state.setGeoJsonError}
        zoom={state.zoom}
        division1={division1}
        setTileLayerUrl={state.setTileLayerUrl}
        setLoading={state.setLoading}
        setSelectedFeature={setSelectedFeature}
        setDrawPolygonMode={setDrawPolygonMode}
        drawPolygonMode={drawPolygonMode}
        setAutDrawPolygonMode={setAutDrawPolygonMode}
        AutdrawPolygonMode={AutdrawPolygonMode}
        showFieldsPopup={showFieldsPopup}
        loadingForm={state.loadingForm}
      />

      <div className="absolute bottom-16 right-4 flex flex-col gap-2 z-[1000]">
        <AudioCueToggle />
      </div>

      {/* Location Error Popup */}
      <LocationErrorPopup
        permissionDenied={state.permissionDenied}
        fetchUserLocation={fetchUserLocation}
        setLocationError={state.setLocationError}
        locationerror={state.locationerror || ""}
      />
    </div>
  );
};

export default MAPPage;
