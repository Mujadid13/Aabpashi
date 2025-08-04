import { useState } from "react";

const useMAPPAGE = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fieldName: "",
    cropTypes: [],
    soilType: "",
  });

  const [featureStats, setFeatureStats] = useState<any>(null);
  const [tileLayerUrl, setTileLayerUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationerror, setLocationError] = useState<string | null>(null);

  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [zoom, setZoom] = useState(6);

  const [polygonCoordinates, setPolygonCoordinates] = useState<any | null>(null);

  // Plotting canals code
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [loadingGeoJSON, setLoadingGeoJSON] = useState(true);
  const [geoJsonError, setGeoJsonError] = useState<string | null>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  const [loadingForm, setLoadingForm] = useState(false);

  return {
    showForm,
    setShowForm,
    formData,
    setFormData,
    featureStats,
    setFeatureStats,
    tileLayerUrl,
    setTileLayerUrl,
    error,
    setError,
    showPopup,
    setShowPopup,
    loading,
    setLoading,
    permissionDenied,
    setPermissionDenied,
    zoom,
    setZoom,
    polygonCoordinates,
    setPolygonCoordinates,
    geoJsonData,
    setGeoJsonData,
    loadingGeoJSON,
    setLoadingGeoJSON,
    geoJsonError,
    setGeoJsonError,
    fields,
    setFields,
    isNewUser,
    setIsNewUser,
    loadingForm,
    setLoadingForm,
    locationerror, 
    setLocationError
  };
};

export default useMAPPAGE;
