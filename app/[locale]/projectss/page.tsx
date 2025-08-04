"use client";

import React from "react";
import Image from "next/image";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations, useLocale } from "next-intl";
import icons from "@/data/icons";

export default function Projects() {
  const t = useTranslations("projects");
  const locale = useLocale();
  const isRTL = locale === "ur";

  const {
    showPopup,
    handleLogin,
    handleLogout,
    handleRegister,
    handleCancel,
    setShowPopup,
    userId,
  } = useAuthHandlers();

  const focusAreas = t.raw("focusAreas");

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
      <div className="hero-container-56">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1745612292/vecteezy_irrigation-water-flow-from-pipe-to-canal-for-agriculture-fields_17775417_meahgb.jpg"
            alt="About Us Hero Image"
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

      {/* Program Overview */}
      <section className="program-overview-section">
        <h2 className="program-overview-heading">{t("overviewHeading")}</h2>
        <p
          className="program-overview-text"
          dir={locale === "ur" ? "rtl" : "ltr"}
        >
          {t("overviewText")}
        </p>
      </section>

      {/* Key Focus Areas */}
      <div className="focus-section-wrapper">
        <section className="focus-section">
          <h2 className="focus-section-heading">{t("focusHeading")}</h2>
          <div className="focus-grid">
            {focusAreas.map((focus: any, index: number) => (
              <div
                key={index}
                className={`focus-card ${
                  isRTL ? "rtl-focus-card" : "ltr-focus-card"
                }`}
              >
                <div className="focus-icon">
                  {React.createElement(
                    icons[Object.keys(icons)[index] as keyof typeof icons]
                  )}
                </div>
                <div>
                  <h3 className="focus-card-title">{focus.title}</h3>
                  <p className="focus-card-description">{focus.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sustainability Statement */}
      <section className="sustainability-section" dir={isRTL ? "rtl" : "ltr"}>
        <p
          className={`sustainability-text ${
            isRTL ? "text-right-align" : "text-left-align"
          }`}
        >
          {t("sustainabilityStatement")}
        </p>
      </section>

      <Footer />
    </div>
  );
}
