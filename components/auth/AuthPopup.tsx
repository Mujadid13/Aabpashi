"use client";

import { useTranslations } from "next-intl";

export default function AuthPopup({
  handleLoginAction,
  handleRegisterAction,
  handleCancelAction,
}: {
  handleLoginAction: () => void;
  handleRegisterAction: () => void;
  handleCancelAction: () => void;
}) {
  const t = useTranslations("authPopup");

  return (
    <div className="auth-popup-overlay">
      <div className="auth-popup-container">
        <button className="auth-popup-close" onClick={handleCancelAction}>
          ✕
        </button>
        <h2 className="auth-popup-title">{t("title")}</h2>
        <p className="auth-popup-text">{t("description")}</p>
        <div className="flex flex-col items-center gap-4">
          <button onClick={handleLoginAction} className="auth-popup-button">
            {t("login")}
          </button>
          <button onClick={handleRegisterAction} className="auth-popup-button">
            {t("register")}
          </button>
        </div>
      </div>
    </div>
  );
}
