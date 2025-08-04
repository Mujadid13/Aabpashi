const features = [
  {
    name: "Water Release Schedule",
    label: {
      en: "Water Release Schedule",
      ur: "پانی جاری کرنے کا شیڈول"
    },
    action: (
      setSelectedFeature: (feature: string | null) => void,
      setShowSearchPopup: (state: boolean) => void
    ) => {
      setShowSearchPopup(true);
      setSelectedFeature(null);
    }
  },
  {
    name: "Weather Forecast",
    label: {
      en: "Weather Forecast",
      ur: "موسم کی پیشگوئی"
    },
    action: (setSelectedFeature: (feature: string | null) => void) => {
      setSelectedFeature("Weather Forecast");
    },
    disabled: (selectedField: any) => !selectedField
  },
  {
    name: "Water Stress",
    label: {
      en: "Water Stress",
      ur: "پانی کی کمی"
    },
    action: (setSelectedFeature: (feature: string | null) => void) => {
      setSelectedFeature("Water Stress");
    },
    disabled: (selectedField: any) => !selectedField
  },
  {
    name: "Register Complaint",
    label: {
      en: "Register Complaint",
      ur: "شکایت درج کریں"
    },
    action: (
      _setSelectedFeature: any,
      _setShowSearchPopup: any,
      setShowComplaintModal: (state: boolean) => void
    ) => {
      setShowComplaintModal(true);
    }
  }
];

export default features;
