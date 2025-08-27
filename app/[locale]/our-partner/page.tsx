"use client";

import React from "react";
import Image from "next/image";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";

export default function OurPartners() {
  const {
    showPopup,
    handleLogin,
    handleLogout,
    handleRegister,
    handleCancel,
    setShowPopup,
    userId,
  } = useAuthHandlers();

  const t = useTranslations("partners");

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

      <div className="partners-wrapper">
        <div className="partners-hero">
          <Image
            src="https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1745612292/vecteezy_irrigation-water-flow-from-pipe-to-canal-for-agriculture-fields_17775417_meahgb.jpg"
            alt="Partners Hero Image"
            layout="fill"
            objectFit="cover"
            className="partners-hero-image"
          />
          <div className="partners-hero-overlay">
            <h1 className="partners-title">{t("title")}</h1>
            <p className="partners-breadcrumb">{t("breadcrumb")}</p>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
