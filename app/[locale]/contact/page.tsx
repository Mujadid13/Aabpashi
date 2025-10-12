"use client";

import React from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Contact() {
  const t = useTranslations("contact-form");

  const {
    showPopup,
    userId,
    handleLogin,
    handleLogout,
    handleRegister,
    handleCancel,
    setShowPopup,
  } = useAuthHandlers();

  const locale = useLocale();
  const isRTL = ["ur", "pa", "sd"].includes(locale);

  const [showSuccessPopup, setShowSuccessPopup] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; // ✅ Save before await

    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    if (!name || !phone || !message) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = { name, phone, email, message };

    try {
      const res = await fetch("../../api/savecontact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        form.reset();
        setShowSuccessPopup(true); // ✅ now works
      } else {
        console.error("Failed to send message:", await res.text());
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

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
      <div className="technology-section-55">
        <div className="hero-container-56">
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
      </div>

      {/* Contact Section */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("contactHeading")}
            </h2>
            <p
              className={`text-gray-700 max-w-2xl mx-auto ${
                isRTL ? "text-right" : "text-left"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {t("introText")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t("description")}
              </h3>
              <div className="space-y-2 text-gray-800">
                <p>
                  <strong>{t("email")}:</strong> farmovation@farmovation.tech
                </p>
                <p>
                  <strong>{t("phone")}:</strong> +92 306 9028028
                </p>
                <p>
                  <strong>{t("address")}:</strong> Pakistan, Lahore
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
            >
              <div
                className="bg-gradient-to-r from-green-600 to-blue-500 text-white px-4 py-2 rounded-md text-lg font-semibold shadow-md"
                dir={isRTL ? "rtl" : "ltr"}
                style={{ textAlign: isRTL ? "right" : "left" }}
              >
                {t("contactHeading2")}
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t("name")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder:text-gray-400 transition focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t("phone")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder:text-gray-400 transition focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t("email")}
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder:text-gray-400 transition focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t("message")} <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder:text-gray-400 transition focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:opacity-90 transition"
              >
                {t("submit")}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              {t("successTitle")}
            </h2>
            <p className="text-gray-700">{t("successMessage")}</p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
