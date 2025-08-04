"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { voiceVideos } from "@/data/voiceVideos";
import { Navigation } from "swiper/modules";
import { useTranslations } from "next-intl";

const VoiceOfFarmers = () => {
  const t = useTranslations("voiceOfFarmers");

  return (
    <section className="voice-section">
      <h2 className="voice-title">🎤 {t("title")}</h2>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        loop={false}
        slidesPerView={1}
        breakpoints={{
          768: {
            slidesPerView: voiceVideos.length < 3 ? voiceVideos.length : 2,
          },
          1280: {
            slidesPerView: voiceVideos.length < 3 ? voiceVideos.length : 3,
          },
        }}
      >
        {voiceVideos.map((video) => (
          <SwiperSlide key={video.id}>
            <iframe
              src={video.url}
              className="youtube-embed"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              title={video.title}
            ></iframe>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default VoiceOfFarmers;
