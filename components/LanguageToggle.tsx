"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useTranslations } from "next-intl";

const LanguageToggle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("languageToggle");

  const currentLocale = pathname.split("/")[1];

  const handleLanguageChange = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;

    const segments = pathname.split("/");
    segments[1] = locale;
    const newPath = segments.join("/");

    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="language-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {t("label")}
      </button>

      {isOpen && (
        <div className="language-dropdown">
          <ul className="language-dropdown-list">
            <li>
              <button
                className={clsx(
                  "language-option",
                  currentLocale === "en" && "language-option-active"
                )}
                onClick={() => handleLanguageChange("en")}
              >
                {t("english")}
              </button>
            </li>
            <li>
              <button
                className={clsx(
                  "language-option",
                  currentLocale === "ur" && "language-option-active"
                )}
                onClick={() => handleLanguageChange("ur")}
              >
                {t("urdu")}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
