// hooks/useFieldsForm.ts
import { SingleValue, StylesConfig, GroupBase } from "react-select";
import { useFields } from "./useFields";
import { useLocale } from "next-intl";

interface UseFieldsFormProps {
  userId: string | null;
  setFields: React.Dispatch<React.SetStateAction<any[]>>;
  setLoadingForm: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFieldsPopup: (value: boolean) => void;
  setError: (value: string) => void;
  setSelectedField: (field: any | null) => void;
  setPosition: (pos: [number, number] | null) => void;
  setAccuracy: (value: number | null) => void;
  setSelectedFeature: (feature: string | null) => void;
  setIsNewUser: (value: boolean) => void;
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
  setShowForm: (value: boolean) => void;
  setZoom: (value: number) => void;
  fields: any[];
}

export const useFieldsForm = ({
  userId,
  setFields,
  setLoadingForm,
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
  fields,
}: UseFieldsFormProps) => {
  const { fetchFields } = useFields(
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

  const customSelectStyles: StylesConfig<
    { value: string; label: string },
    boolean,
    GroupBase<{ value: string; label: string }>
  > = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#3B82F6" : provided.borderColor,
      boxShadow: state.isFocused ? "0 0 0 1px #3B82F6" : provided.boxShadow,
      "&:hover": {
        borderColor: "#BFDBFE",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#BFDBFE"
        : state.isSelected
        ? "#BFDBFE"
        : provided.backgroundColor,
      color: state.isFocused || state.isSelected ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#BFDBFE",
        color: "#fff",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#BFDBFE",
      color: "#000",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#000",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#000",
      "&:hover": {
        backgroundColor: "#BFDBFE",
        color: "#fff",
      },
    }),
  };

  const customSingleSelectStyles: StylesConfig<
    { value: string; label: string },
    false
  > = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#3B82F6" : provided.borderColor,
      boxShadow: state.isFocused ? "0 0 0 1px #3B82F6" : provided.boxShadow,
      "&:hover": {
        borderColor: "#BFDBFE",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#BFDBFE"
        : state.isSelected
        ? "#BFDBFE"
        : provided.backgroundColor,
      color: state.isFocused || state.isSelected ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#BFDBFE",
        color: "#fff",
      },
    }),
  };

  const cropOptions = {
    rabi: [
      { value: "Wheat", label: { en: "Wheat", ur: "گندم" } },
      { value: "Maize", label: { en: "Maize", ur: "مکئی" } },
      { value: "Gram", label: { en: "Gram", ur: "چنا" } },
      { value: "Pulses", label: { en: "Pulses", ur: "دالیں" } },
      { value: "Oil seeds", label: { en: "Oil Seeds", ur: "تیل دار بیج" } },
      { value: "Fodder", label: { en: "Fodder", ur: "چارہ" } },
      { value: "Vegetables", label: { en: "Vegetables", ur: "سبزیاں" } },
      { value: "Fruits", label: { en: "Fruits", ur: "پھل" } },
      { value: "Others", label: { en: "Others", ur: "دیگر" } },
    ],
    kharif: [
      { value: "Rice", label: { en: "Rice", ur: "چاول" } },
      { value: "Cotton", label: { en: "Cotton", ur: "کپاس" } },
      { value: "Sugarcane", label: { en: "Sugarcane", ur: "گنا" } },
      { value: "Maize", label: { en: "Maize", ur: "مکئی" } },
      { value: "Pulses", label: { en: "Pulses", ur: "دالیں" } },
      { value: "Orchard", label: { en: "Orchard", ur: "باغات" } },
      { value: "Oil seeds", label: { en: "Oil Seeds", ur: "تیل دار بیج" } },
      { value: "Fodder", label: { en: "Fodder", ur: "چارہ" } },
      { value: "Vegetables", label: { en: "Vegetables", ur: "سبزیاں" } },
      { value: "Others", label: { en: "Others", ur: "دیگر" } },
    ],
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    return month >= 4 && month <= 9 ? "kharif" : "rabi";
  };

  const locale = useLocale();

  const currentSeason = getCurrentSeason();
  const mappedCrops = cropOptions[currentSeason].map((option) => ({
    value: option.value,
    label: option.label[locale as "en" | "ur"],
  }));

  const soilOptions = [
    { value: "Sandy Loam", label: { en: "Sandy Loam", ur: "سینڈی لوم" } },
    { value: "Loam", label: { en: "Loam", ur: "لوم" } },
    { value: "Silt Loam", label: { en: "Silt Loam", ur: "سیلٹ لوم" } },
    { value: "Clay Loam", label: { en: "Clay Loam", ur: "کلی لوم" } },
    {
      value: "Silty Clay Loam",
      label: { en: "Silty Clay Loam", ur: "سلٹی کلی لوم" },
    },
  ];

  const mappedSoils = soilOptions.map((option) => ({
    value: option.value,
    label: option.label[locale as "en" | "ur"],
  }));

  const handleCropChange = (selectedOptions: any) => {
    setFormData((prev) => ({
      ...prev,
      cropTypes: selectedOptions
        ? selectedOptions.map((opt: { value: any }) => opt.value)
        : [],
    }));
  };

  const handleSoilChange = (
    selectedOption: SingleValue<{ value: string; label: string }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      soilType: selectedOption ? selectedOption.value : "",
    }));
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleSubmit = async () => {
    if (
      !formData.fieldName ||
      formData.cropTypes.length === 0 ||
      !formData.soilType
    ) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    setLoadingForm(true);

    const fieldData = {
      fieldName: formData.fieldName,
      cropTypes: formData.cropTypes,
      soilType: formData.soilType,
      location: { lat: position?.[0] ?? 0, lng: position?.[1] ?? 0 },
      userId,
    };

    setShowForm(false);

    try {
      const response = await fetch("/api/savefield", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fieldData),
      });

      if (!response.ok) {
        throw new Error("Failed to save field data");
      }

      const result = await response.json();

      setIsNewUser(false);
      setSelectedFeature(null);
      setAccuracy(null);
      setPosition(null);
      setFormData({ fieldName: "", cropTypes: [], soilType: "" });
      setLoadingForm(false);

      await fetchFields();
    } catch (error) {
      console.error("Error submitting field data:", error);
    }
  };

  return {
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
    
  };
};
