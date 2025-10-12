"use client";

import { useLocale, useTranslations } from "next-intl";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import Image from "next/image";
import {
  waterAcademyOffers,
  waterAcademyEligibility,
} from "@/data/waterAcademy";

export default function WaterAcademy() {
  const t = useTranslations("waterAcademy");
  t("about.heading");

  const locale = useLocale();
  const isRTL = ["ur", "pa", "sd"].includes(locale);

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
    <div className="water-academy-container">
      <Header
        userId={userId}
        handleLogout={handleLogout}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleCancel={handleCancel}
      />

      <div className="technology-section-56">
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
            <h1 className="hero-title-56">{t("header.title")}</h1>
            <p className="hero-breadcrumb-56">{t("header.breadcrumb")}</p>
          </div>
        </div>

        <div className="water-academy-about">
          <h2 className="water-academy-section-title">{t("about.title")}</h2>
          <h1 className="water-academy-heading">{t("about.heading")}</h1>
          <p
            className="water-academy-description"
            dir={locale === "ur" ? "rtl" : "ltr"}
          >
            {t("about.description")}
          </p>
        </div>

        <div className="water-academy-mission">
          <h2 className="water-academy-mission-title">{t("mission.title")}</h2>
          <p className="water-academy-mission-text">{t("mission.text")}</p>
        </div>

        <div className="water-academy-offers">
          <h2 className="water-academy-section-title">{t("offers.title")}</h2>
          <h1 className="water-academy-heading">{t("offers.heading")}</h1>

          <div
            className={`flex flex-col ${
              isRTL ? "items-end" : "items-start"
            } gap-2`}
          >
            <ul className="water-academy-list" dir={isRTL ? "rtl" : "ltr"}>
              {waterAcademyOffers.map((key, idx) => (
                <li key={idx}>{t(key)}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="water-academy-eligibility">
          <h2 className="water-academy-eligibility-title">
            {t("eligibility.title")}
          </h2>
          <h1 className="water-academy-heading">{t("eligibility.heading")}</h1>
          <ul className="water-academy-benefits">
            {waterAcademyEligibility.map((key, idx) => (
              <li key={idx}>{t(key)}</li>
            ))}
          </ul>
        </div>

        <div className="water-academy-cta">
          <h2 className="water-academy-cta-title">{t("cta.title")}</h2>
          <p className="water-academy-cta-text">{t("cta.text")}</p>
          <button className="water-academy-button">{t("cta.button")}</button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
