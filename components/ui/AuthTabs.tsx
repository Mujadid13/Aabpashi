"use client";

import { useTranslations } from "next-intl";

interface AuthTabsProps {
  activeTab: "login" | "register";
  setActiveTabAction: (tab: "login" | "register") => void;
}

export default function AuthTabs({ activeTab, setActiveTabAction }: AuthTabsProps) {
  const t = useTranslations("authTabs");

  return (
    <div className="auth-tabs-container">
      <button
        className={`auth-tab-btn ${
          activeTab === "login" ? "auth-tab-active" : "auth-tab-inactive"
        }`}
        onClick={() => setActiveTabAction("login")}
      >
        {t("login")}
      </button>
      <button
        className={`auth-tab-btn auth-tab-spacing ${
          activeTab === "register" ? "auth-tab-active" : "auth-tab-inactive"
        }`}
        onClick={() => setActiveTabAction("register")}
      >
        {t("register")}
      </button>
    </div>
  );
}
