"use client";

import React from "react";
import Image from "next/image";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import { benefitImages, benefitColors } from "@/data/impactbenefits";



export default function OurImpact() {
  const t = useTranslations("ourImpact");
  const {
    showPopup,
    userId,
    handleLogin,
    handleLogout,
    handleRegister,
    handleCancel,
    setShowPopup,
  } = useAuthHandlers();

  const impactData = t.raw("impactData");
  const benefits = t.raw("benefitsData");

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
      <div className="technology-section-56">
        <div className="hero-container-56 relative">
          <div className="absolute inset-0">
            <Image
              src="https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1745612292/vecteezy_irrigation-water-flow-from-pipe-to-canal-for-agriculture-fields_17775417_meahgb.jpg"
              alt="Hero"
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

        {/* Impact Section */}
        <div className="impact-container-76">
          <h2 className="impact-title-76">{t("impactHeading")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
            {impactData.map((item: any, index: number) => (
              <div key={index} className="impact-card-76">
                <h3 className="impact-value-76 text-blue-600 font-bold text-xl">
                  {item.highlight}
                </h3>
                <p className="impact-text-76">
                  {item.text.replace(item.highlight, "").trim()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="benefits-section-76">
          <h2 className="benefits-heading-76">{t("benefitsHeading")}</h2>
          <h1 className="benefits-title-76">{t("benefitsTitle")}</h1>

          <div className="benefit-div-761">
            {benefits.map((benefit: any, index: number) => (
              <div key={index} className="benefits-card-76">
                <div className="relative w-24 h-24 rounded-full overflow-hidden">
                  <Image
                    src={benefitImages[index]}
                    alt={benefit.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="benefits-content-76">
                  <h3 className="benefits-text-76">{benefit.title}</h3>
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
