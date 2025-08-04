"use client";

import { useLocale, useTranslations } from "next-intl";
import receiverNetworks from "@/data/receiverNetworks";

interface LoginFormProps {
  loginData: { phone: string; receiverNetwork: string };
  setLoginDataAction: (data: {
    phone: string;
    receiverNetwork: string;
  }) => void;
  handleLoginAction: (event: React.FormEvent) => void;
  otpSent: boolean;
  setOtpAction: React.Dispatch<React.SetStateAction<string>>;
  otp: string;
  isLoadingOtp: boolean;
  isLoadingBoth: boolean;
  isLoadingBoth1: boolean;
  errorState: string | null;
  showOtpPopup: boolean;
  setShowOtpPopupAction: React.Dispatch<React.SetStateAction<boolean>>;
  verifyOtpAction: (event: React.FormEvent) => void;
  sendOtpAction: (receiverNetwork: string) => void;
  otperrorState: string | null;
}

export default function LoginForm({
  loginData,
  setLoginDataAction,
  handleLoginAction,
  setOtpAction,
  otp,
  otpSent,
  isLoadingOtp,
  isLoadingBoth,
  isLoadingBoth1,
  errorState,
  showOtpPopup,
  setShowOtpPopupAction,
  verifyOtpAction,
  sendOtpAction,
  otperrorState,
}: LoginFormProps) {
  const t = useTranslations("login");
  const t1 = useTranslations("errors");
  const locale = useLocale();

  const errorMap: Record<string, string> = {
    // General errors
    "Phone number is required": "phoneRequired",
    "Invalid phone number format. Use +92XXXXXXXXXX": "invalidFormat",
    "This phone number is not registered. Please sign up first.":
      "notRegistered",
    "User already exists.": "userExists",
    "Registration failed. Please try again.": "registerFail",

    // OTP-specific errors
    "OTP expired": "otpExpired",
    "Invalid OTP": "invalidOtp",
    "OTP already sent, please wait before requesting again": "otpAlreadySent",
    "Failed to send OTP": "sendFailed",
    "Internal server error during OTP login": "serverError",
  };

  return (
    <form onSubmit={handleLoginAction} className="login-form">
      <div className="login-form-group">
        <label className="login-label">{t("phoneLabel")}</label>
        <div className="login-input-group">
          <span className="login-country-code">+92</span>
          <input
            type="tel"
            className="login-input"
            placeholder={t("phonePlaceholder")}
            value={loginData.phone}
            onChange={(e) =>
              setLoginDataAction({
                ...loginData,
                phone: e.currentTarget.value.replace(/\D/g, "").slice(0, 10),
              })
            }
            onBlur={(e) => {
              const errorMessage = document.getElementById("login-phone-error");
              const formGroup = e.currentTarget.closest(".login-form-group");
              const isInvalid = e.currentTarget.value.trim().length !== 10;
              e.currentTarget.classList.toggle("error", isInvalid);
              errorMessage &&
                (errorMessage.style.display = isInvalid ? "block" : "none");
              formGroup && formGroup.classList.toggle("has-error", isInvalid);
            }}
            onFocus={(e) => {
              const errorMessage = document.getElementById("login-phone-error");
              const formGroup = e.currentTarget.closest(".login-form-group");
              e.currentTarget.classList.remove("error");
              errorMessage && (errorMessage.style.display = "none");
              formGroup && formGroup.classList.remove("has-error");
            }}
          />
        </div>
        <p id="login-phone-error" className="error-message">
          {t("phoneError")}
        </p>
      </div>

      {errorState && (
        <p className="error-message1">
          { errorMap[errorState]
            ? t1( errorMap[errorState])
            : errorState}
        </p>
      )}

      <button
        type="button"
        className="login-button"
        onClick={handleLoginAction}
        disabled={isLoadingOtp || otpSent || loginData.phone.length !== 10}
      >
        {isLoadingOtp ? (
          <span className="flex items-center justify-center w-full">
            {t("loggingIn")} <Spinner />
          </span>
        ) : (
          t("loginButton")
        )}
      </button>

      {/* OTP Popup */}
      {showOtpPopup && (
        <div className="otp-popup-overlay">
          <div className="otp-popup">
            <h2 className="otp-title">{t("otpTitle")}</h2>
            <p className="otp-message">
              {t("otpMessage", { phone: loginData.phone })}
            </p>

            <div className="otp-form-group">
              <input
                type="text"
                className="otp-input"
                placeholder={t("otpPlaceholder")}
                value={otp}
                onChange={(e) =>
                  setOtpAction(e.currentTarget.value.replace(/\D/g, ""))
                }
                onBlur={(e) => {
                  const errorMessage = document.getElementById("otp-error");
                  const formGroup = e.currentTarget.closest(".otp-form-group");
                  const isInvalid = e.currentTarget.value.trim().length !== 4;
                  e.currentTarget.classList.toggle("error", isInvalid);
                  errorMessage &&
                    (errorMessage.style.display = isInvalid ? "block" : "none");
                  formGroup &&
                    formGroup.classList.toggle("has-error", isInvalid);
                }}
                onFocus={(e) => {
                  const errorMessage = document.getElementById("otp-error");
                  const formGroup = e.currentTarget.closest(".otp-form-group");
                  e.currentTarget.classList.remove("error");
                  errorMessage && (errorMessage.style.display = "none");
                  formGroup && formGroup.classList.remove("has-error");
                }}
              />
              <p id="otp-error" className="error-message">
                {t("otpError")}
              </p>
              {otperrorState && (
                <p className="error-message1">
                  {errorMap[otperrorState]
                    ? t1(errorMap[otperrorState])
                    : otperrorState}
                </p>
              )}

            </div>

            <div className="otp-buttons">
              <button
                className="otp-verify-button"
                onClick={verifyOtpAction}
                disabled={isLoadingBoth || otp.length !== 4}
              >
                {isLoadingBoth ? (
                  <span className="flex items-center justify-center w-full">
                    {t("verifying")} <Spinner />
                  </span>
                ) : (
                  t("validateOtp")
                )}
              </button>

              <button
                className="otp-resend-button"
                onClick={() => sendOtpAction(loginData.receiverNetwork)}
                disabled={isLoadingBoth1}
              >
                {isLoadingBoth1 ? (
                  <span className="flex items-center justify-center w-full">
                    {t("resending")} <Spinner />
                  </span>
                ) : (
                  t("resendOtp")
                )}
              </button>

              <button
                className="otp-cancel-button"
                onClick={() => setShowOtpPopupAction(false)}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 ml-2 text-white"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}
