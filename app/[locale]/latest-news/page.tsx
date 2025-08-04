"use client";

import React from "react";
import Image from "next/image";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";

export default function LatestNews() {
  const {
    showPopup,
    handleLogin,
    handleLogout,
    handleRegister,
    handleCancel,
    setShowPopup,
    userId,
  } = useAuthHandlers();

  const t = useTranslations("news");

  return (
     <div className="page-wrapper">
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
      <div className="news-wrapper">
        <div className="news-hero">
          <Image
            src="https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1745612292/vecteezy_irrigation-water-flow-from-pipe-to-canal-for-agriculture-fields_17775417_meahgb.jpg"
            alt="Latest News Hero"
            layout="fill"
            objectFit="cover"
            className="news-hero-image"
          />
          <div className="news-hero-overlay">
            <h1 className="news-title">{t("title")}</h1>
            <p className="news-breadcrumb">{t("breadcrumb")}</p>
          </div>
        </div>

        {/* Future: News articles or feed go here */}
      </div>

      <Footer />
    </div>
  );
}
