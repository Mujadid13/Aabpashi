import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFields } from "@/hooks/useFields";
import { useAudioCue } from "@/context/AudioCueContext";
import { useTranslations, useLocale } from "next-intl";
import {
  translateCropType,
  translateSoilType,
} from "@/lib/translateFieldTypes";

interface FieldPopupProps {
  setShowFieldsPopup: (value: boolean) => void;
  selectedField: any | null;
  setSelectedField: (field: any | null) => void;
  setPosition: (pos: [number, number] | null) => void;
  fields: any[];
  setFields: (fields: any[]) => void;
  setIsNewUser: (value: boolean) => void;
  setError: (value: string) => void;
  setAccuracy: (value: number | null) => void;
  setSelectedFeature: (value: any | null) => void;
  showFieldsPopup: boolean;
  userId: string | null;
  setZoom: (value: number) => void;
  setLoadingForm: (value: boolean) => void;
  loadingForm: boolean;
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
  zoom: number;
  position: [number, number] | null;
}

const FieldPopup: React.FC<FieldPopupProps> = ({
  setShowFieldsPopup,
  selectedField,
  setSelectedField,
  setPosition,
  fields,
  setFields,
  setIsNewUser,
  setError,
  setAccuracy,
  setSelectedFeature,
  showFieldsPopup,
  userId,
  setZoom,
  setLoadingForm,
  loadingForm,
  confirmDelete,
  setConfirmDelete,
  zoom,
  position,
}) => {
  const { audioCueEnabled, playAudioCue, stopAudioCue } = useAudioCue();

  const { fetchFields, handleFieldSelection, handleDeleteField } = useFields(
    userId,
    setFields,
    setIsNewUser,
    setShowFieldsPopup,
    setError,
    setSelectedField,
    setPosition,
    setAccuracy,
    setSelectedFeature,
    setZoom,
    setLoadingForm,
    fields
  );

  useEffect(() => {
    if (userId) {
      fetchFields();
    }
  }, [fetchFields, userId]);

  useEffect(() => {
    if (!audioCueEnabled) return;

    if (showFieldsPopup) {
      playAudioCue("selectField");
    }
  }, [audioCueEnabled, playAudioCue, showFieldsPopup]);

  const t = useTranslations("fieldPopup");
  const locale = useLocale();

  const defaultCenter: [number, number] = [30.3753, 69.3451];

  return (
    <div>
      {loadingForm ? (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p className="loading-text">{t("loading")}</p>
        </div>
      ) : (
        showFieldsPopup && (
          <div className="popup-overlay">
            <div className="popup-container">
              <h3 className="popup-header">{t("selectField")}</h3>
              <div className="scrollable-container">
                {fields.length === 0 ? (
                  <p className="no-fields-text">{t("noFields")}</p>
                ) : (
                  fields.map((field) => (
                    <div
                      key={field._id}
                      className={`field-item ${
                        selectedField && selectedField._id === field._id
                          ? "selected-field"
                          : ""
                      }`}
                      onMouseEnter={(e) =>
                        e.currentTarget.classList.add("hover-field")
                      }
                      onMouseLeave={(e) =>
                        e.currentTarget.classList.remove("hover-field")
                      }
                      onClick={() => {
                        if (selectedField && selectedField._id === field._id) {
                          setSelectedField(null);
                          setShowFieldsPopup(false);
                          setPosition(null);
                          setZoom(6);
                        } else {
                          handleFieldSelection(field);
                        }
                      }}
                    >
                      <div>
                        <p className="field-name">
                          {t("fieldName")}: {field.fieldName}
                        </p>
                        <p className="field-info">
                          {t("cropTypes")}:{" "}
                          {field.cropTypes
                            .map((crop: string) =>
                              translateCropType(crop, locale)
                            )
                            .join(", ")}
                        </p>
                        <p className="field-info">
                          {t("soilType")}:{" "}
                          {translateSoilType(field.soilType, locale)}
                        </p>
                      </div>

                      <button
                        className="delete-button"
                        onMouseEnter={(e) =>
                          e.currentTarget.classList.add("hover-delete")
                        }
                        onMouseLeave={(e) =>
                          e.currentTarget.classList.remove("hover-delete")
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete({
                            show: true,
                            fieldId: field._id,
                            fieldName: field.fieldName,
                          });
                        }}
                      >
                        <Trash2 size={22} color="red" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button
                className="close-button-form"
                onMouseEnter={(e) =>
                  e.currentTarget.classList.add("hover-close")
                }
                onMouseLeave={(e) =>
                  e.currentTarget.classList.remove("hover-close")
                }
                onClick={() => {
                  setShowFieldsPopup(false);
                  stopAudioCue();
                }}
              >
                {t("close")}
              </button>
            </div>

            {confirmDelete.show && (
              <div className="popup-overlay">
                <div className="popup-container">
                  <h3 className="popup-header">
                    {t("confirmHeader")}
                  </h3>

                  <p className="popup-message-42">
                    {t("confirmMessage")}{" "}
                    <strong className="popup-field-name-42">
                      {confirmDelete.fieldName}
                    </strong>
                    ?
                  </p>

                  <div className="popup-actions-42">
                    <button
                      className="btn-cancel-42"
                      onClick={() =>
                        setConfirmDelete({
                          show: false,
                          fieldId: null,
                          fieldName: "",
                        })
                      }
                    >
                      {t("cancel")}
                    </button>
                    <button
                      className="btn-delete-42"
                      onClick={() => {
                        if (confirmDelete.fieldId) {
                          handleDeleteField(confirmDelete.fieldId);
                          setConfirmDelete({
                            show: false,
                            fieldId: null,
                            fieldName: "",
                          });
                        }
                      }}
                    >
                      {t("delete")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default FieldPopup;
