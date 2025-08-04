import React from "react";
import Select from "react-select";
import { useFieldsForm } from "@/hooks/useFieldsForm";
import { useTranslations } from "next-intl";

interface FieldsFormProps {
  showForm: boolean;
  setShowForm: (value: boolean) => void;
  formData: {
    fieldName: string;
    cropTypes: string[];
    soilType: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      fieldName: string;
      cropTypes: string[];
      soilType: string;
    }>
  >;
  position: [number, number] | null;
  setSelectedFeature: (feature: string | null) => void;
  setIsNewUser: (value: boolean) => void;
  setAccuracy: (value: number | null) => void;
  setPosition: (pos: [number, number] | null) => void;
  userId: string | null;
  setFields: React.Dispatch<React.SetStateAction<any[]>>;
  setLoadingForm: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFieldsPopup: (value: boolean) => void;
  setError: (value: string) => void;
  setSelectedField: (field: any | null) => void;
  setZoom: (value: number) => void;
  loadingForm: boolean;
}

const FieldsForm: React.FC<FieldsFormProps> = ({
  showForm,
  setShowForm,
  formData,
  setFormData,
  position,
  setSelectedFeature,
  setIsNewUser,
  setAccuracy,
  setPosition,
  userId,
  setFields,
  setLoadingForm,
  setShowFieldsPopup,
  setError,
  setSelectedField,
  setZoom,
  loadingForm,
}) => {
  const {
    mappedCrops,
    soilOptions,
    handleCropChange,
    handleSoilChange,
    handleSubmit,
    currentSeason,
    customSelectStyles,
    customSingleSelectStyles,
    capitalizeFirstLetter,
    mappedSoils,
  } = useFieldsForm({
    userId,
    setFields,
    setShowFieldsPopup,
    setError,
    setSelectedField,
    setPosition,
    setAccuracy,
    setSelectedFeature,
    setIsNewUser,
    setFormData,
    formData,
    position,
    setShowForm,
    setZoom,
    setLoadingForm,
    fields: [],
  });

  const t = useTranslations("fieldsForm");

  return (
    <div>
      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <button
              className="form-close-button"
              onClick={() => setShowForm(false)}
            >
              ✖
            </button>
            {/* Form Title */}
            <h3 className="form-header">🌾 {t("formTitle")}</h3>

            {/* Field Name Input */}
            <label className="form-label">
              📍 {t("fieldName")}:
              <input
                type="text"
                name="fieldName"
                value={formData.fieldName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fieldName: e.target.value,
                  }))
                }
                className="form-input"
                placeholder={t("fieldNamePlaceholder")}
              />
            </label>

            {/* Crop Type Selection */}
            <label className="form-label">
              🌱 {currentSeason} {t("cropTypes")}:
              <Select
                options={mappedCrops}
                isMulti
                onChange={handleCropChange}
                placeholder={t("selectCrops")}
                styles={customSelectStyles}
              />
            </label>

            {/* Soil Type Selection */}
            <label className="form-label">
              🏞️ {t("soilType")}:
              <Select
                options={mappedSoils}
                onChange={handleSoilChange}
                placeholder={t("selectSoil")}
                styles={customSingleSelectStyles}
              />
            </label>

            {/* Action Buttons */}
            <div className="form-button-container">
              <button
                onClick={handleSubmit}
                disabled={
                  loadingForm ||
                  !formData.fieldName ||
                  formData.cropTypes.length === 0 ||
                  !formData.soilType
                }
                className={`submit-button-form ${
                  loadingForm ||
                  !formData.fieldName ||
                  formData.cropTypes.length === 0 ||
                  !formData.soilType
                    ? "submit-button-form-disabled"
                    : ""
                }`}
              >
                {loadingForm ? (
                  <span className="flex items-center justify-center w-full">
                    {t("fetching")}
                  </span>
                ) : (
                  t("submit")
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldsForm;
