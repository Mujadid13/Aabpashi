export const translateCropType = (crop: string, locale: string): string => {
  if (locale !== "ur") return crop;
  const map: Record<string, string> = {
    Sugarcane: "گنا",
    Maize: "مکئی",
    Cotton: "کپاس",
    Pulses: "دالیں",
    Wheat: "گندم",
    Rice: "چاول"
  };
  return map[crop] || crop;
};

export const translateSoilType = (soil: string, locale: string): string => {
  if (locale !== "ur") return soil;
  const map: Record<string, string> = {
    "Silt Loam": "سیلٹ لوم",
    "Clay Loam": "کلی لوم",
    "Sandy Loam": "سینڈی لوم",
    "Loamy Sand": "لومی ریت"
  };
  return map[soil] || soil;
};
