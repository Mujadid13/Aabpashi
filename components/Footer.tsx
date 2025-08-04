"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useFooterAnimation } from "@/hooks/useFooterAnimation";
import { quickLinks } from "@/data/footerLinks";
import { socialLinks, contactLinks } from "@/data/socialLinks";
import { useTranslations, useLocale } from "next-intl";

const Footer: React.FC = () => {
  const { ref, hasAnimated, showLoader, router } = useFooterAnimation();
  const t = useTranslations("footer");
  const locale = useLocale();
  const isRTL = locale === "ur"; // or any RTL language code

  return (
    <footer ref={ref} className={`footer ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="footer-overlay" />
      <div className="footer-container">
        {/* Logo & Slogans */}
        <div className="footer-section">
          <Image
            src="https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1746126580/logo-icon_tfghku.png"
            alt="Farmovation Logo"
            width={80}
            height={80}
            className="footer-logo"
          />
          {["slogan1", "slogan2", "slogan3", "slogan4"].map((key, i) => (
            <motion.p
              key={i}
              className={i % 2 === 0 ? "footer-heading" : "footer-text"}
              initial={{ opacity: 0 }}
              animate={hasAnimated ? { opacity: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.1 }}
            >
              {t(`slogans.${key}`)}
            </motion.p>
          ))}
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <motion.h3
            className="footer-heading underline"
            initial={{ opacity: 0 }}
            animate={hasAnimated ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            {t("quickLinks.title")}
          </motion.h3>
          <ul>
            {quickLinks.map((item, i) => (
              <motion.li
                key={item.label}
                className={`footer-link ${!item.enabled ? "disabled" : ""}`}
                initial={{ opacity: 0 }}
                animate={hasAnimated ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.2 }}
              >
                {item.enabled ? (
                  <button
                    onClick={() => {
                      showLoader();
                      router.push(item.route);
                    }}
                    className="text-inherit hover:underline"
                  >
                    {t(`quickLinks.items.${item.label}`)}
                  </button>
                ) : (
                  <span>{t(`quickLinks.items.${item.label}`)}</span>
                )}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Contact Info + Socials */}
        <div className="footer-contact">
          <motion.h3
            className="footer-heading underline"
            initial={{ opacity: 0 }}
            animate={hasAnimated ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            {t("contact.title")}
          </motion.h3>

          {contactLinks.map((info, i) => (
            <motion.p
              key={info.label}
              initial={{ opacity: 0 }}
              animate={hasAnimated ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="footer-contact-item"
            >
              {t(`contact.labels.${info.label}`)}:{" "}
              <a href={info.href}>
                <span dir="ltr">{info.value}</span>
              </a>
            </motion.p>
          ))}

          <div className="footer-social-icons">
            {socialLinks.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                initial={{ opacity: 0 }}
                animate={hasAnimated ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <link.icon className="w-6 h-6" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-copyright">
        <motion.p
          initial={{ opacity: 0 }}
          animate={hasAnimated ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          &copy; {new Date().getFullYear()} Farmovation Pakistan. {t("rights")}
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;
