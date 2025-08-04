"use client";

import React from "react";
import Image from "next/image";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";

export default function Tutorial() {
  const {
    showPopup,
    userId,
    handleLogin,
    handleLogout,
    handleRegister,
    handleCancel,
    setShowPopup,
  } = useAuthHandlers();

  const t = useTranslations("tutorial");
  const videoTitles = t.raw("videos");

  const tutorialVideos = [
    { src: "/videos/Enter-Farm.mp4" },
    { src: "/videos/login-process.mp4" },
    { src: "/videos/register-complaints.mp4" },
    { src: "/videos/registration-process.mp4" },
    { src: "/videos/water-release-by-field.mp4" },
    { src: "/videos/water-release-by-search.mp4" },
  ];

  return (
    <div className="tutorial-page">
      <Header
        userId={userId}
        handleLogout={handleLogout}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleCancel={handleCancel}
      />

      {/* Hero Section */}
      <div className="hero-container-56">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1745612292/vecteezy_irrigation-water-flow-from-pipe-to-canal-for-agriculture-fields_17775417_meahgb.jpg"
            alt="Tutorial Hero Image"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="hero-overlay-56">
          <h1 className="hero-title-56">{t("title")}</h1>
          <p className="hero-breadcrumb-56">{t("breadcrumb")}</p>
        </div>
      </div>

      {/* Tutorial Videos Section */}
      <div className="tutorial-videos-wrapper">
        <h2 className="tutorial-heading">{t("sectionHeading")}</h2>
        <div className="tutorial-grid">
          {tutorialVideos.map((video, index) => (
            <div key={index} className="tutorial-card">
              <div className="tutorial-video">
                <video
                  src={video.src}
                  controls
                  className="video-player"
                  poster={`/thumbnails/${video.src
                    .split("/")
                    .pop()
                    ?.replace(".mp4", ".jpg")}`}
                  preload="metadata"
                />
              </div>
              <div className="tutorial-title-wrapper">
                <h3 className="tutorial-video-title">
                  {videoTitles[index]?.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
