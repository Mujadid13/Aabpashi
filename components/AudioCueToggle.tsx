"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useAudioCue } from "@/context/AudioCueContext";
import { Volume2, VolumeX } from "lucide-react";

const AudioCueToggle: React.FC = () => {
  const { audioCueEnabled, setAudioCueEnabled } = useAudioCue();
  const t = useTranslations("audioCue");

  return (
    <motion.button
      onClick={() => setAudioCueEnabled(!audioCueEnabled)}
      className="audio-cue-toggle"
      whileTap={{ scale: 0.95 }}
    >
      {audioCueEnabled ? (
        <Volume2 size={18} className="audio-cue-icon-on" />
      ) : (
        <VolumeX size={18} className="audio-cue-icon-off" />
      )}
      {t("label")}:{" "}
      <span suppressHydrationWarning>
        {audioCueEnabled ? t("on") : t("off")}
      </span>
    </motion.button>
  );
};

export default AudioCueToggle;
