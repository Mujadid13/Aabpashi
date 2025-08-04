"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { audioMap } from "@/lib/audiomap";

interface AudioCueContextType {
  audioCueEnabled: boolean;
  setAudioCueEnabled: (enabled: boolean) => void;
  playAudioCue: (key: keyof typeof audioMap) => void;
  stopAudioCue: () => void;
}

const AudioCueContext = createContext<AudioCueContextType | undefined>(undefined);

export const AudioCueProvider = ({ children }: { children: React.ReactNode }) => {
  const [audioCueEnabled, setAudioCueEnabledState] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null); // ✅ managed here

  useEffect(() => {
    const stored = localStorage.getItem("audioCueEnabled");
    if (stored !== null) {
      setAudioCueEnabledState(stored === "true");
    }
  }, []);

  const setAudioCueEnabled = (enabled: boolean) => {
    setAudioCueEnabledState(enabled);
    localStorage.setItem("audioCueEnabled", String(enabled));
  };

  const playAudioCue = (key: keyof typeof audioMap) => {
    if (!audioCueEnabled) return;
  
    // Stop any currently playing audio first
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  
    // Now play the new one
    const audio = new Audio(audioMap[key]);
    audio.volume = 1;
    audio.play().catch((err) => console.warn("Audio failed:", err));
    audioRef.current = audio;
  };

  const stopAudioCue = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  return (
    <AudioCueContext.Provider
      value={{ audioCueEnabled, setAudioCueEnabled, playAudioCue, stopAudioCue }}
    >
      {children}
    </AudioCueContext.Provider>
  );
};

export const useAudioCue = (): AudioCueContextType => {
  const context = useContext(AudioCueContext);
  if (!context) throw new Error("useAudioCue must be used within AudioCueProvider");
  return context;
};
