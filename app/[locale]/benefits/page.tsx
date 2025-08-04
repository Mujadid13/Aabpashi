"use client";

import React from "react";
import Image from "next/image";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";

import { benefitImages, benefitColors } from "@/data/impactbenefits";


export default function Benefits() {
  const {
    showPopup,
    handleLogin,
    handleLogout,
    handleRegister,
    handleCancel,
    setShowPopup,
    userId,
  } = useAuthHandlers();

  const t = useTranslations("benefits");
  const items = t.raw("items");

  return (
    <div className="page-container-76">
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
      <div className="our-impact-section-76">
        <div className="hero-section-76 relative">
          <Image
            src="https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1745612292/vecteezy_irrigation-water-flow-from-pipe-to-canal-for-agriculture-fields_17775417_meahgb.jpg"
            alt="Benefits Hero Image"
            layout="fill"
            objectFit="cover"
            priority
            className="absolute inset-0"
          />
          <div className="hero-overlay-76">
            <h1 className="hero-title-76">{t("title")}</h1>
            <p className="hero-subtitle-76">{t("breadcrumb")}</p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="benefits-section-76-1">
          <h2 className="benefits-heading-76-1">{t("heading")}</h2>
          <h1 className="benefits-title-76-1">{t("sectionTitle")}</h1>

          <div className="benefit-div-76">
            {items.map((benefit: any, index: number) => (
              <div key={index} className="benefits-card-76-1">
                <Image
                  src={benefitImages[index] || "/icons/default-placeholder.png"}
                  alt={benefit.title}
                  width={100}
                  height={100}
                  className="benefits-image-76-1"
                />
                <div className="benefits-content-76-1">
                  <h3 className="benefits-text-76-1">{benefit.title}</h3>
                  <p className={`${benefitColors[index]} font-semibold`}>
                    {benefit.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
