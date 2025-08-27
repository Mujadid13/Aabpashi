"use client";

import React from "react";
import Image from "next/image";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocale } from "next-intl";

export default function Scaleup() {
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

  return (
    <div
      className={`page-wrapper bg-white text-gray-900 ${isRTL ? "rtl" : ""}`}
    >
      <Header
        userId={userId}
        handleLogout={handleLogout}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleCancel={handleCancel}
      />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div className={`${isRTL ? "text-right" : ""}`}>
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-gray-900">
              Scaling AabPashi
              <br />
              <span className="text-primary">Water-Secure Farms.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-700 leading-relaxed">
              AabPashi combines satellite analytics, weather intelligence, GPS
              canal monitoring, and farmer-first schedules to optimize water
              allocation, enhance crop yields, and drive climate
              resilience—starting in Pakistan, scaling beyond.
            </p>
          </div>

          <figure className="relative aspect-[16/10] overflow-hidden rounded-2xl border shadow-lg">
            <Image
              src="/system-diagram.png"
              alt="AabPashi system overview"
              fill
              className="object-contain bg-white"
              priority
            />
          </figure>
        </div>
      </section>

      {/* PROGRAM SNAPSHOT */}
      <section className="bg-blue-100 pt-20 pb-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Water Stress Maps",
                desc: "Satellite-based alerts flag risky fields before it’s too late.",
              },
              {
                title: "Weather Alerts",
                desc: "Localized forecasts + smart advisories reduce weather damage.",
              },
              {
                title: "GPS Canal Tracking",
                desc: "Real-time canal monitoring prevents leakage and theft.",
              },
              {
                title: "Irrigation Schedules",
                desc: "Crop-aware delivery schedules reach farmers directly.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-blue-200 bg-white p-6 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILOT MAP & DIVISIONS */}
      <section id="pilot" className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid items-start gap-14 md:grid-cols-[3fr_2fr]">
          {/* Left: Image (60%) */}
          <figure className="relative h-[480px] overflow-hidden rounded-2xl border shadow-lg bg-white flex items-center justify-center p-4">
            <Image
              src="/pilot-divisions.png"
              alt="Pilot operating divisions"
              width={2400} // ⬅️ Increase this to enlarge image
              height={1000}
              className="object-contain"
            />
          </figure>

          {/* Right: Text (40%) */}
          <div className={`${isRTL ? "text-right" : ""}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Pilot Operating Divisions
            </h2>
            <p className="mt-4 text-gray-700 text-lg leading-relaxed">
              Field pilots validate usability, reliability, and efficiency
              across varied canal types, regions, and farming practices.
            </p>

            <ul className="mt-6 space-y-2 text-base text-gray-700">
              <li>• Kasur</li>
              <li>• Hakra</li>
              <li>• Pandoki</li>
              <li>• Rahim Yar Khan</li>
            </ul>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-800 mb-2">
                  Early Signals
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Water wastage down, reporting time faster, field coverage
                  rising.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-800 mb-2">
                  What We Measure
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Water saved, yield delta, service uptime, and real-world
                  engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPANSION LANDSCAPE */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2
          className={`text-3xl md:text-4xl font-bold text-gray-900 ${
            isRTL ? "text-right" : ""
          }`}
        >
          Expansion Landscape
        </h2>
        <p
          className={`mt-4 text-lg text-gray-700 leading-relaxed ${
            isRTL ? "text-right" : ""
          }`}
        >
          With early proof points established, AabPashi is now preparing to
          scale— nationally and regionally—through public-private coalitions and
          institutional partnerships.
        </p>

        <figure className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border shadow-md">
          <Image
            src="/expansion-landscape.png"
            alt="Expansion strategy map"
            fill
            className="object-contain bg-white"
          />
        </figure>
      </section>

      <Footer />
    </div>
  );
}
