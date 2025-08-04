"use client";

import countries from "@/data/pakistanCities";
import receiverNetworks from "@/data/receiverNetworks";
import irrigationDivisions from "@/data/irrigationDivisions";
import roles from "@/data/roles";
import farmSizes from "@/data/farmSizes";
import { useLocale, useTranslations } from "next-intl";
import Select from "react-select";

interface RegisterFormProps {
  registerData: {
    name: string;
    city: string;
    phone: string;
    receiverNetwork: string;
    division: string;
    farmsize: string;
    role: string;
    country: string;
  };
  setRegisterDataAction: (data: {
    name: string;
    city: string;
    phone: string;
    receiverNetwork: string;
    division: string;
    farmsize: string;
    role: string;
    country: string;
  }) => void;
  isLoadingBoth: boolean;
  otpSent: boolean;
  setOtpAction: React.Dispatch<React.SetStateAction<string>>;
  handleRegisterAction: () => void;
  otp: string;
  isLoadingOtp: boolean;
  verifyOtpAction: () => void;
  showOtpPopup: boolean;
  setShowOtpPopupAction: React.Dispatch<React.SetStateAction<boolean>>;
  registererrorState: string | null;
  otperrorState: string | null;
  sendOtpAction: (receiverNetwork: string) => void;
  isLoadingBoth1: boolean;
  handleCountryChangeAction: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleCityChangeAction: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedCountry:
    | {
        value: string;
        label: {
          en: string;
          ur: string;
        };
        cities: {
          value: string;
          label: {
            en: string;
            ur: string;
          };
        }[];
      }
    | undefined;
}

export default function RegisterForm({
  registerData,
  setRegisterDataAction,
  isLoadingBoth,
  otpSent,
  setOtpAction,
  handleRegisterAction,
  otp,
  isLoadingOtp,
  verifyOtpAction,
  showOtpPopup,
  setShowOtpPopupAction,
  registererrorState,
  otperrorState,
  sendOtpAction,
  isLoadingBoth1,
  handleCountryChangeAction,
  handleCityChangeAction,
  selectedCountry,
}: RegisterFormProps) {
  const t = useTranslations("register");
  const t1 = useTranslations("errors");
  const locale = useLocale();

  const errorMap: Record<string, string> = {
    // General errors
    "Phone number is required": "phoneRequired",
    "Invalid phone number format. Use +92XXXXXXXXXX": "invalidFormat",
    "This phone number is not registered. Please sign up first.":
      "notRegistered",
    "A user with this phone number already exists.": "userExists",
    "Registration failed. Please try again.": "registerFail",

    // OTP-specific errors
    "OTP expired": "otpExpired",
    "Invalid OTP": "invalidOtp",
    "OTP already sent. Please wait before requesting again.": "otpAlreadySent",
    "Failed to send OTP": "sendFailed",
    "Internal server error during OTP login": "serverError",
  };

  return (
    <form className="register-form">
      {/* Full Name Field */}
      <div className="register-form-group">
        <label className="register-label">{t("fullName")}</label>
        <input
          type="text"
          className="register-input"
          placeholder={t("fullNamePlaceholder")}
          value={registerData.name}
          onChange={(e) =>
            setRegisterDataAction({
              ...registerData,
              name: e.currentTarget.value,
            })
          }
          onBlur={(e) => {
            const nameParts = e.currentTarget.value.trim().split(/\s+/);
            const errorMessage = document.getElementById("name-error");
            const formGroup = e.currentTarget.closest(".register-form-group");

            if (nameParts.length < 2) {
              e.currentTarget.classList.add("error");
              if (errorMessage) errorMessage.style.display = "block";
              if (formGroup) formGroup.classList.add("has-error");
            } else {
              e.currentTarget.classList.remove("error");
              if (errorMessage) errorMessage.style.display = "none";
              if (formGroup) formGroup.classList.remove("has-error");
            }
          }}
          onFocus={(e) => {
            e.currentTarget.classList.remove("error");
            const errorMessage = document.getElementById("name-error");
            const formGroup = e.currentTarget.closest(".register-form-group");

            if (errorMessage) errorMessage.style.display = "none";
            if (formGroup) formGroup.classList.remove("has-error");
          }}
        />
        <p id="name-error" className="error-message">
          {t("fullNameError")}
        </p>
      </div>

      {/* Phone Number Field */}
      <div className="register-form-group">
        <label className="register-label">{t("phone")}</label>
        <div className="register-input-group">
          <span className="register-country-code">+92</span>
          <input
            type="tel"
            className="register-input outline-none border-none"
            placeholder={t("phonePlaceholder")}
            value={registerData.phone}
            onChange={(e) => {
              const cleanedValue = e.currentTarget.value
                .replace(/\D/g, "")
                .slice(0, 10);
              setRegisterDataAction({ ...registerData, phone: cleanedValue });
            }}
            onBlur={(e) => {
              const phoneNumber = e.currentTarget.value.trim();
              const errorMessage = document.getElementById("phone-error");
              const formGroup = e.currentTarget.closest(".register-form-group");

              if (phoneNumber.length !== 10) {
                e.currentTarget.classList.add("error");
                if (errorMessage) errorMessage.style.display = "block";
                if (formGroup) formGroup.classList.add("has-error");
              } else {
                e.currentTarget.classList.remove("error");
                if (errorMessage) errorMessage.style.display = "none";
                if (formGroup) formGroup.classList.remove("has-error");
              }
            }}
            onFocus={(e) => {
              e.currentTarget.classList.remove("error");
              const errorMessage = document.getElementById("phone-error");
              const formGroup = e.currentTarget.closest(".register-form-group");

              if (errorMessage) errorMessage.style.display = "none";
              if (formGroup) formGroup.classList.remove("has-error");
            }}
          />
        </div>
        <p id="phone-error" className="error-message">
          {t("phoneError")}
        </p>
      </div>

      {/* Select Network Field */}
      <div className="register-form-group">
        <label className="register-label">{t("simNetwork")}</label>
        <select
          className="register-input"
          value={registerData.receiverNetwork}
          onChange={(e) =>
            setRegisterDataAction({
              ...registerData,
              receiverNetwork: e.currentTarget.value,
            })
          }
          onBlur={(e) => {
            const errorMessage = document.getElementById("network-error");
            const formGroup = e.currentTarget.closest(".register-form-group");

            if (e.currentTarget.value === "") {
              e.currentTarget.classList.add("error");
              if (errorMessage) errorMessage.style.display = "block";
              if (formGroup) formGroup.classList.add("has-error");
            } else {
              e.currentTarget.classList.remove("error");
              if (errorMessage) errorMessage.style.display = "none";
              if (formGroup) formGroup.classList.remove("has-error");
            }
          }}
          onFocus={(e) => {
            e.currentTarget.classList.remove("error");
            const errorMessage = document.getElementById("network-error");
            const formGroup = e.currentTarget.closest(".register-form-group");

            if (errorMessage) errorMessage.style.display = "none";
            if (formGroup) formGroup.classList.remove("has-error");
          }}
        >
          <option value="">{t("simNetworkPlaceholder")}</option>
          {receiverNetworks
            .filter((net) => net.value !== "")
            .map((net) => (
              <option key={net.value} value={net.value}>
                {net.label[locale as "en" | "ur"]}
              </option>
            ))}
        </select>
        <p id="network-error" className="error-message">
          {t("simNetworkError")}
        </p>
      </div>

      {/* Country/City Dropdown */}
      <div className="register-form-group">
        <label className="register-label">{t("country")}</label>
        <select
          className="register-input"
          value={registerData.country}
          onChange={handleCountryChangeAction}
          onBlur={(e) => {
            const errorMessage = document.getElementById("country-error");
            const formGroup = e.currentTarget.closest(".register-form-group");

            const hasValue = e.currentTarget.value !== "";
            e.currentTarget.classList.toggle("error", !hasValue);
            if (errorMessage)
              errorMessage.style.display = hasValue ? "none" : "block";
            if (formGroup) formGroup.classList.toggle("has-error", !hasValue);
          }}
          onFocus={(e) => {
            e.currentTarget.classList.remove("error");
            const errorMessage = document.getElementById("country-error");
            const formGroup = e.currentTarget.closest(".register-form-group");

            if (errorMessage) errorMessage.style.display = "none";
            if (formGroup) formGroup.classList.remove("has-error");
          }}
        >
          <option value="">{t("countryPlaceholder")}</option>
          {countries.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label[locale as "en" | "ur"]}
            </option>
          ))}
        </select>
        <p id="country-error" className="error-message">
          {t("countryError")}
        </p>
      </div>

      {/* City Dropdown */}
      <div className="register-form-group">
        <label className="register-label">{t("city")}</label>
        <Select
          options={
            selectedCountry?.cities.map((city) => ({
              value: city.value,
              label: city.label[locale as "en" | "ur"],
            })) || []
          }
          value={
            selectedCountry?.cities
              .map((city) => ({
                value: city.value,
                label: city.label[locale as "en" | "ur"],
              }))
              .find((opt) => opt.value === registerData.city) || null
          }
          onChange={(option) => {
            if (option) {
              setRegisterDataAction({
                ...registerData,
                city: option.value,
              });
            }
          }}
          placeholder={
            registerData.country
              ? t("cityPlaceholder")
              : t("countryPlaceholder")
          }
          isDisabled={!selectedCountry}
          classNamePrefix="react-select"
          onBlur={() => {
            const errorMessage = document.getElementById("city-error");
            const formGroup = document.querySelector(
              ".register-form-group .react-select__control"
            )?.parentElement;

            const hasValue = registerData.city !== "";
            const control = document.querySelector(".react-select__control");

            if (!hasValue) {
              control?.classList.add("error");
              if (errorMessage) errorMessage.style.display = "block";
              if (formGroup) formGroup.classList.add("has-error");
            } else {
              control?.classList.remove("error");
              if (errorMessage) errorMessage.style.display = "none";
              if (formGroup) formGroup.classList.remove("has-error");
            }
          }}
        />
        <p id="city-error" className="error-message">
          {t("cityError")}
        </p>
      </div>

      {/* Select Your Irrigation Divison */}
      <div className="register-form-group">
        <label className="register-label">{t("division")}</label>
        <select
          className="register-input"
          value={registerData.division}
          onChange={(e) =>
            setRegisterDataAction({
              ...registerData,
              division: e.currentTarget.value,
            })
          }
          onBlur={(e) => {
            const errorMessage = document.getElementById("division-error");
            const formGroup = e.currentTarget.closest(".register-form-group");
            const hasValue = e.currentTarget.value !== "";

            e.currentTarget.classList.toggle("error", !hasValue);
            if (errorMessage)
              errorMessage.style.display = hasValue ? "none" : "block";
            if (formGroup) formGroup.classList.toggle("has-error", !hasValue);
          }}
          onFocus={(e) => {
            e.currentTarget.classList.remove("error");
            const errorMessage = document.getElementById("division-error");
            const formGroup = e.currentTarget.closest(".register-form-group");

            if (errorMessage) errorMessage.style.display = "none";
            if (formGroup) formGroup.classList.remove("has-error");
          }}
        >
          <option value="">{t("divisionPlaceholder")}</option>
          {irrigationDivisions.map((div) => (
            <option key={div.value} value={div.value}>
              {div.label[locale as "en" | "ur"]}
            </option>
          ))}
        </select>
        <p id="division-error" className="error-message">
          {t("divisionError")}
        </p>
      </div>

      {/* Farm Size */}
      <div className="register-form-group">
        <label className="register-label">{t("farmSize")}</label>
        <select
          className="register-input"
          value={registerData.farmsize}
          onChange={(e) =>
            setRegisterDataAction({
              ...registerData,
              farmsize: e.currentTarget.value,
            })
          }
          onBlur={(e) => {
            const errorMessage = document.getElementById("farm-size-error");
            const formGroup = e.currentTarget.closest(".register-form-group");
            const hasValue = e.currentTarget.value !== "";

            e.currentTarget.classList.toggle("error", !hasValue);
            if (errorMessage)
              errorMessage.style.display = hasValue ? "none" : "block";
            if (formGroup) formGroup.classList.toggle("has-error", !hasValue);
          }}
          onFocus={(e) => {
            e.currentTarget.classList.remove("error");
            const errorMessage = document.getElementById("farm-size-error");
            const formGroup = e.currentTarget.closest(".register-form-group");

            if (errorMessage) errorMessage.style.display = "none";
            if (formGroup) formGroup.classList.remove("has-error");
          }}
        >
          <option value="">{t("farmSizePlaceholder")}</option>
          {farmSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label[locale as "en" | "ur"]}
            </option>
          ))}
        </select>
        <p id="farm-size-error" className="error-message">
          {t("farmSizeError")}
        </p>
      </div>

      {/* Role */}
      <div className="register-form-group">
        <label className="register-label">{t("role")}</label>
        <select
          className="register-input"
          value={registerData.role}
          onChange={(e) =>
            setRegisterDataAction({
              ...registerData,
              role: e.currentTarget.value,
            })
          }
          onBlur={(e) => {
            const errorMessage = document.getElementById("role-error");
            const formGroup = e.currentTarget.closest(".register-form-group");
            const hasValue = e.currentTarget.value !== "";

            e.currentTarget.classList.toggle("error", !hasValue);
            if (errorMessage)
              errorMessage.style.display = hasValue ? "none" : "block";
            if (formGroup) formGroup.classList.toggle("has-error", !hasValue);
          }}
          onFocus={(e) => {
            e.currentTarget.classList.remove("error");
            const errorMessage = document.getElementById("role-error");
            const formGroup = e.currentTarget.closest(".register-form-group");

            if (errorMessage) errorMessage.style.display = "none";
            if (formGroup) formGroup.classList.remove("has-error");
          }}
        >
          <option value="">{t("rolePlaceholder")}</option>
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label[locale as "en" | "ur"]}
            </option>
          ))}
        </select>
        <p id="role-error" className="error-message">
          {t("roleError")}
        </p>
      </div>

      {registererrorState && (
        <p className="error-message1" id="general-error">
          {errorMap[registererrorState]
            ? t1(errorMap[registererrorState])
            : registererrorState}
        </p>
      )}

      {/* Register Button */}
      <button
        type="button"
        className="register-button"
        onClick={handleRegisterAction}
        disabled={
          isLoadingOtp ||
          otpSent ||
          !registerData.name.trim() ||
          !registerData.city.trim() ||
          !registerData.phone ||
          registerData.phone.length !== 10 ||
          !registerData.receiverNetwork ||
          !registerData.division ||
          !registerData.farmsize ||
          !registerData.role ||
          !registerData.country
        }
      >
        {isLoadingOtp ? (
          <span className="flex items-center justify-center w-full">
            {t("registering")}...
            <svg
              className="animate-spin h-5 w-5 ml-2 text-white"
              viewBox="0 0 24 24"
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
          </span>
        ) : (
          t("register")
        )}
      </button>

      {/* OTP Popup */}
      {showOtpPopup && (
        <div className="otp-popup-overlay">
          <div className="otp-popup">
            <h2 className="otp-title">{t("otpTitle")}</h2>
            <p className="otp-message">
              {t("otpMessage")} +92{registerData.phone}.
              <br />
              {t("otpInstruction")}
            </p>

            {/* OTP Input */}
            <div className=" otp-form-group">
              <input
                type="text"
                className="otp-input"
                placeholder={t("otpPlaceholder")}
                value={otp}
                onChange={(e) => {
                  const numericOtp = e.currentTarget.value.replace(/\D/g, "");
                  setOtpAction(numericOtp);
                }}
                onBlur={(e) => {
                  const otpValue = e.currentTarget.value.trim();
                  const errorMessage = document.getElementById("otp-error");
                  const formGroup = e.currentTarget.closest(".otp-form-group");

                  if (otpValue.length !== 4) {
                    e.currentTarget.classList.add("error");
                    if (errorMessage) errorMessage.style.display = "block";
                    if (formGroup) formGroup.classList.add("has-error");
                  } else {
                    e.currentTarget.classList.remove("error");
                    if (errorMessage) errorMessage.style.display = "none";
                    if (formGroup) formGroup.classList.remove("has-error");
                  }
                }}
                onFocus={(e) => {
                  e.currentTarget.classList.remove("error");
                  const errorMessage = document.getElementById("otp-error");
                  const formGroup = e.currentTarget.closest(".otp-form-group");

                  if (errorMessage) errorMessage.style.display = "none";
                  if (formGroup) formGroup.classList.remove("has-error");
                }}
              />
              <p id="otp-error" className="error-message">
                {t("otpError")}
              </p>
            </div>

            {/* OTP Errors */}
            {otperrorState && (
              <p className="error-message1" id="general-error">
                {errorMap[otperrorState]
                  ? t1(errorMap[otperrorState])
                  : otperrorState}
              </p>
            )}

            {/* OTP Actions */}
            <div className="otp-buttons">
              <button
                className="otp-verify-button"
                onClick={verifyOtpAction}
                disabled={isLoadingBoth || otp.length !== 4}
              >
                {isLoadingBoth ? (
                  <span className="flex items-center justify-center w-full">
                    {t("verifying")}...
                    <svg
                      className="animate-spin h-5 w-5 ml-2 text-white"
                      viewBox="0 0 24 24"
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
                  </span>
                ) : (
                  t("verifyOtp")
                )}
              </button>

              <button
                className="otp-resend-button"
                onClick={() => sendOtpAction(registerData.receiverNetwork)}
                disabled={isLoadingBoth1}
              >
                {isLoadingBoth1 ? (
                  <span className="flex items-center justify-center w-full">
                    {t("resendingOtp")}...
                    <svg
                      className="animate-spin h-5 w-5 ml-2 text-white"
                      viewBox="0 0 24 24"
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
