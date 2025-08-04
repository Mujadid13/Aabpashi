"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { useTranslations, useLocale } from "next-intl";
import clsx from "clsx";

export default function ScreenSection() {
  const t = useTranslations("screenSection");
  const locale = useLocale();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(sectionRef, 0.2);
  const benefits: string[] = t.raw("benefits");
  const isRTL = locale === "ur" || locale === "ar";

  return (
    <div
      className="screen-section"
      ref={sectionRef}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="screen-inner">
        {/* Left - Benefits List */}
        <motion.div
          className={clsx("screen-left", isRTL ? "text-right" : "text-left")}
          initial={{ opacity: 0, x: -50, rotateY: -15 }}
          animate={inView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="screen-heading">{t("heading")}</h2>
          <ul
            className={clsx(
              "screen-benefits-list",
              isRTL ? "rtl" : "ltr"
            )}
          >
            {benefits.map((benefit, index) => (
              <motion.li
                key={index}
                className="screen-benefit-item"
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <span className="screen-check-icon">✔</span>
                <span>{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right - Image */}
        <motion.div
          className="screen-right"
          initial={{ opacity: 0, scale: 0.8, rotateY: 10 }}
          animate={inView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="screen-image-container">
            <Image
              src="https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1745612293/Slide3_yrq6lg.png"
              alt="Aab Pashi Dashboard"
              width={900}
              height={500}
              className="screen-dashboard-img"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
