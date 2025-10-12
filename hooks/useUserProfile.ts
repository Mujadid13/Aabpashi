import { useRef, useEffect, useState } from "react";
import { audioMap } from "@/lib/audiomap";
import { useAudioCue } from "@/context/AudioCueContext";
import { useInViewOnce } from "./useInViewOnce";
import { useAuthForms } from "./useAuthForms";
import { useLocale } from "next-intl";
import { jwtDecode } from "jwt-decode";

type MetaData = {
  name: string;
  phone: string;
  city: string;
  country: string;
  division: string;
  farmsize: string;
  role: string;
  [key: string]: string;
};

export function useUserProfile(
  showPopup: boolean,
  setShowPopupAction: (value: boolean) => void
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { audioCueEnabled } = useAudioCue();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { fullname } = useAuthForms();
  const [translatedName, setTranslatedName] = useState(fullname);
  const profileRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useInViewOnce(profileRef);
  const locale = useLocale();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [metaData, setMetaData] = useState<MetaData>({
    name: "",
    phone: "",
    city: "",
    country: "",
    division: "",
    farmsize: "",
    role: "",
  });


  const handleDiscoverClick = () => {
    if (audioCueEnabled) {
      const audio = new Audio(audioMap.registration);
      audio.volume = 1;
      audio.play().catch((err) => {
        console.warn("Autoplay failed", err);
      });
      audioRef.current = audio;
    }

    setShowPopupAction(true);
  };

  const handleChangeInfo = () => {
    setShowUpdateModal(true);
  };

  useEffect(() => {
    if (!showPopup && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [showPopup]);

  useEffect(() => {
    if (!fullname) return;

    const cacheKey = `nameTranslations_${locale}`;
    const cache = JSON.parse(localStorage.getItem(cacheKey) || "{}");

    // Use cached translation if available or skip for non-allowed locales
    const allowedLocales = ["ur", "pa", "sd"];
    const shouldTranslate = allowedLocales.includes(locale);

    if (!shouldTranslate || cache[fullname]) {
      setTranslatedName(cache[fullname] || fullname);
      return;
    }

    const translateName = async () => {
      try {
        const res = await fetch("/api/translatename", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: [fullname],
            target: locale === "pa" ? "ur" : locale, // pa → ur fallback
          }),
        });

        const data = await res.json();
        const translated = data.translation?.[0] || fullname;

        cache[fullname] = translated;
        localStorage.setItem(cacheKey, JSON.stringify(cache));
        setTranslatedName(translated);
      } catch {
        setTranslatedName(fullname);
      }
    };

    translateName();
  }, [fullname, locale]);

  useEffect(() => {
    const metaToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("meta_token1="))
      ?.split("=")[1];

    if (metaToken) {
      try {
        const decoded: any = jwtDecode(metaToken);
        setMetaData({
          name: decoded.name || "",
          phone: decoded.phone || "",
          city: decoded.city || "",
          country: decoded.country || "",
          division: decoded.division || "",
          farmsize: decoded.farmsize || "",
          role: decoded.role || "",
        });
      } catch (error) {
        console.error("Failed to decode meta_token", error);
      }
    }
  }, []);

  return {
    profileMenuOpen,
    setProfileMenuOpen,
    handleDiscoverClick,
    handleChangeInfo,
    profileRef,
    hasAnimated,
    fullname,
    translatedName,
    showUpdateModal, 
    setShowUpdateModal,
    metaData,
  };
}
