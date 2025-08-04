import { useCallback, useEffect, useState } from "react";

export const useFields = (
  userId: string | null,
  setFields: (fields: any[]) => void,
  setIsNewUser: (value: boolean) => void,
  setShowFieldsPopup: (value: boolean) => void,
  setError: (value: string) => void,
  setSelectedField: (field: any | null) => void,
  setPosition: (pos: [number, number] | null) => void,
  setAccuracy: (value: number | null) => void,
  setSelectedFeature: (value: any | null) => void,
  setZoom: (value: number) => void,
  setLoadingForm: (value: boolean) => void,
  fields: any[],
) => {



  const fetchFields = useCallback(async () => {
    if (!userId) return;

    setLoadingForm(true);
  
    try {
      const response = await fetch("/api/getfield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setFields(data.fields);
        setIsNewUser(data.fields.length === 0);
        setShowFieldsPopup(data.fields.length > 0);
      } else {
        setError(data.error || "Failed to load fields.");
      }
    } catch (err) {
      setError("An error occurred while fetching fields.");
    } finally {
      setLoadingForm(false);
    }
  }, [userId, setFields, setIsNewUser, setLoadingForm, setShowFieldsPopup, setError]);

  const handleDeleteField = async (fieldId: string) => {
    try {
      const res = await fetch("/api/deletefield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: fieldId }),
      });

      const result = await res.json();

      if (res.ok) {
        setFields(fields.filter((f) => f._id !== fieldId));
      } else {
        console.error("Delete failed:", result.error || result.message);
        setError(result.error || result.message);
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Something went wrong while deleting the field.");
    }
  };



  const handleFieldSelection = useCallback((field: any) => {
    setSelectedField(field);
    setAccuracy(null);
    setZoom(17);
    setPosition([field.location.lat, field.location.lng]);
    setSelectedFeature(null);
    setShowFieldsPopup(false);
  }, [setSelectedField, setAccuracy, setZoom, setPosition, setSelectedFeature, setShowFieldsPopup]);

  return { fetchFields, handleFieldSelection, handleDeleteField };
};
