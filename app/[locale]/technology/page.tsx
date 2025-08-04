"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { featuresLeft, featuresRight } from "@/data/techfeatures";

export default function Technology() {
  const t = useTranslations("technology");

  const {
    showPopup,
    userId,
    handleLogin,
    handleLogout,
    handleRegister,
    handleCancel,
    setShowPopup,
  } = useAuthHandlers();

  return (
    <div className="page-container-56">
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
      <div className="technology-section-56">
        <div className="hero-container-56 relative">
          <div className="absolute inset-0">
            <Image
              src="https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1745612292/vecteezy_irrigation-water-flow-from-pipe-to-canal-for-agriculture-fields_17775417_meahgb.jpg"
              alt="Hero Image"
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

        <h1 className="farmers-heading-56">{t("heading")}</h1>

        {/* Features Layout */}
        <div className="layout-container-56">
          <div className="features-container-56">
            {featuresLeft.map(({ src, altKey }, index) => (
              <div key={index} className="feature-card-56">
                <div className="feature-image-container-56 relative">
                  <Image
                    src={src}
                    alt={t(altKey)}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <p className="feature-text-56">{t(altKey)}</p>
              </div>
            ))}
          </div>

          <div className="farmer-image-container-56">
            <Image
              src="https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1745613478/Picture5_diu0tf.jpg"
              alt="Farmer using technology"
              width={192}
              height={192}
              className="object-cover w-48 h-48"
            />
          </div>

          <div className="features-container-56">
            {featuresRight.map(({ src, altKey }, index) => (
              <div key={index} className="feature-card-56">
                <div className="feature-image-container-56 relative">
                  <Image
                    src={src}
                    alt={t(altKey)}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain"
                  />
                </div>
                <p className="feature-text-56">{t(altKey)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="key-features-container-56">
          <h1 className="key-features-title-56">{t("keyFeaturesTitle")}</h1>
          <ul className="key-features-list-56">
            {t.raw("keyFeatures").map((desc: string, index: number) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="tech-stack-section-56">
        <h1 className="tech-stack-title-56">{t("techStackTitle")}</h1>
        <div className="tech-stack-grid-56">
          {[
            { src: "https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1749209608/image_7_dipcoc.jpg", label: "Next.js – Frontend" },
            { src: "https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1749209608/image_6_et35t6.jpg", label: "Python – Backend API" },
            { src: "https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1749209608/image_8_irtnh9.jpg", label: "Google Earth Engine – Remote Sensing" },
            { src: "https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1749209608/image_3_jhbk68.jpg", label: "MongoDB – Database" },
            { src: "https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1749209609/image_2_jksyzg.jpg", label: "Redis – Temporary Storage" },
            { src: "https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1749209609/image_1_bcd2in.jpg", label: "JavaScript – Remote Sensing API" },
            { src: "https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1749209609/image_ehxexq.jpg", label: "Spext – OTP SMS Alerts" },
            { src: "https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1749209608/image_4_aewrxr.jpg", label: "Open-Meteo – Weather Forecast" },
          ].map(({ src, label }, idx) => (
            <div key={idx} className="tech-card-56">
              <div className="tech-icon-container-56 relative">
                <Image
                  src={src}
                  alt={label}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-contain"
                />
              </div>
              <p className="tech-label-56">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
