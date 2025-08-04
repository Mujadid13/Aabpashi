"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AudioCueToggle from "@/components/AudioCueToggle";
import { useHeroSection } from "@/hooks/useHeroSection";
import LanguageToggle from "../LanguageToggle";
import { scroller } from "react-scroll";

interface HeroSectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  shouldPlayVideo: boolean;
  setShouldPlayVideo: (state: boolean) => void;
  userId: string | null;
}

const HeroSection: React.FC<HeroSectionProps> = (props) => {
  const { sectionRef, hasAnimated, showLoader, handleStartMonitoring, t } =
    useHeroSection({ userId: props.userId });

  const handleScrollAndPlay = () => {
    // Scroll to the video section
    scroller.scrollTo("video-section", {
      smooth: true,
      duration: 500,
      offset: -50,
    });
  };

  return (
    <section className="hero-section" ref={sectionRef}>
      <div className="hero-language-toggle">
        <LanguageToggle />
      </div>

      <div className="hero-audio-toggle">
        <AudioCueToggle />
      </div>

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, x: 20, rotateY: 90 }}
          animate={hasAnimated ? { opacity: 1, x: 0, rotateY: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {t("title")}
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20, rotateX: 90 }}
          animate={hasAnimated ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          {t("subtitle.1")}
        </motion.p>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20, rotateX: 90 }}
          animate={hasAnimated ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        >
          {t("subtitle.2")}
        </motion.p>

        <motion.p
          className="hero-subtitle1"
          initial={{ opacity: 0, y: 20, rotateX: 90 }}
          animate={hasAnimated ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          {t("subtitle.3")}
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 50, rotateX: 90 }}
          animate={hasAnimated ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        >
          <motion.button
            className="hero-button"
            whileTap={{ scale: 0.95, rotateX: -10 }}
            onClick={handleScrollAndPlay}
          >
            {t("button.intro")}
          </motion.button>

          <Link href="/tutorials" onClick={showLoader}>
            <motion.button
              className="hero-button"
              whileTap={{ scale: 0.95, rotateX: -10 }}
            >
              {t("button.tutorial")}
            </motion.button>
          </Link>

          <motion.button
            className="hero-button"
            whileTap={{ scale: 0.95, rotateX: -10 }}
            onClick={handleStartMonitoring}
          >
            {t("button.start")}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
