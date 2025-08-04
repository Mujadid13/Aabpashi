"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import countries from "@/data/pakistanCities";
import { useManualLoader } from "@/context/ManualLoaderContext"; // ✅ make sure path is correct
import { useLocale } from "next-intl";

export function useAuthForms() {
  const [isLoadingBoth, setIsLoadingBoth] = useState(false);
  const [isLoadingBoth1, setIsLoadingBoth1] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginData, setLoginData] = useState({
    phone: "",
    receiverNetwork: "",
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    city: "",
    phone: "",
    receiverNetwork: "",
    division: "",
    farmsize: "",
    role: "",
    country: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errorState, setError] = useState<string | null>(null);
  const [registererrorState, setRegisterError] = useState<string | null>(null);
  const [otperrorState, setotpError] = useState<string | null>(null);
  const [tempdata, setTempdata] = useState({
    name: "",
    city: "",
    phone: "",
    receiverNetwork: "",
    division: "",
    farmsize: "",
    role: "",
    country: "",
  });
  const router = useRouter();
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [division1, setDivision] = useState<string | null>(null);
  const [fullname, setFullname] = useState<string | null>(null);

  const { showLoader, hideLoader } = useManualLoader();

  const locale = useLocale();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setActiveTab(params.get("tab") === "register" ? "register" : "login");
    }
  }, []);

  useEffect(() => {
    if (otpSent && tempdata.phone) {
      setShowOtpPopup(true);
    }
  }, [otpSent, tempdata]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const metaToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("meta_token="))
        ?.split("=")[1];

      if (metaToken) {
        try {
          const decoded: { division?: string; fullName?: string } =
            jwtDecode(metaToken);

          setDivision(decoded.division || null);

          if (decoded.fullName) {
            const parts = decoded.fullName.trim().split(/\s+/); 
            const indexMap = [0, 0, 1, 2]; 
            const index = indexMap[Math.min(parts.length, 4) - 1] || 0;
            const nameToUse = parts[index] || parts[0]; 
            setFullname(nameToUse);
          }
        } catch (error) {
          console.error("Failed to decode meta_token", error);
        }
      }
    }
  }, []);

  const verifyOtp = async () => {
    if (activeTab === "register") {
      await verifyRegisterOtp();
    } else {
      await verifyLoginOtp();
    }
  };

  const verifyRegisterOtp = async () => {
    setIsLoadingBoth(true);
    setotpError(null);

    try {
      const response = await fetch("/api/auth/verifyotp-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: tempdata.phone,
          otp,
          name: tempdata.name,
          city: tempdata.city,
          division: tempdata.division,
          receiverNetwork: tempdata.receiverNetwork,
          farmsize: tempdata.farmsize,
          role: tempdata.role,
          country: tempdata.country,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "OTP verification failed.");
      }

      setTempdata({
        name: "",
        city: "",
        phone: "",
        receiverNetwork: "",
        division: "",
        farmsize: "",
        role: "",
        country: "",
      });

      setOtp("");
      router.push(`/${locale}/field-mapping`);
    } catch (error) {
      const err = error as unknown;
      setotpError(
        err instanceof Error
          ? err.message
          : "An error occurred during OTP verification."
      );
      hideLoader();
    } finally {
      setIsLoadingBoth(false);
      showLoader();
    }
  };

  const verifyLoginOtp = async () => {
    setIsLoadingBoth(true);
    setotpError(null);

    try {
      const response = await fetch("/api/auth/verifyotp-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: tempdata.phone,
          otp,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "OTP verification failed.");
      }

      setTempdata({
        name: "",
        city: "",
        phone: "",
        receiverNetwork: "",
        division: "",
        farmsize: "",
        role: "",
        country: "",
      });

      setOtp("");
      router.push(`/${locale}/field-mapping`);
    } catch (error) {
      const err = error as unknown;
      setotpError(
        err instanceof Error
          ? err.message
          : "An error occurred during OTP verification."
      );
      hideLoader();
    } finally {
      setIsLoadingBoth(false);
      showLoader();
    }
  };

  const sendOtp = async (receiverNetwork: string) => {
    setIsLoadingBoth1(true);
    setotpError(null);

    try {
      const response = await fetch("/api/auth/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: tempdata.phone, receiverNetwork }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpSent(true);
    } catch (error) {
      const err = error as unknown; // ✅ Explicitly cast error
      setotpError(
        err instanceof Error
          ? err.message
          : "Error sending OTP. Please try again."
      );
    } finally {
      setIsLoadingBoth1(false);
    }
  };

  const handleLogin = async () => {
    setIsLoadingOtp(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: loginData.phone,
          receiverNetwork: loginData.receiverNetwork,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.message === "string" ? data.message : "Failed to send OTP"
        );
      }

      setOtpSent(true);
      setTempdata({
        name: data.name || "",
        city: "",
        phone: data.phoneNumber || "",
        receiverNetwork: "",
        division: data.division || "",
        farmsize: "",
        role: "",
        country: "",
      });
    } catch (error) {
      const err = error as unknown; // ✅ Explicitly cast error
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during OTP verification."
      );
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const handleRegister = async () => {
    setIsLoadingOtp(true);
    setError(null);

    try {
      // Register user
      const registerResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const registerResult = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(
          typeof registerResult.message === "string"
            ? registerResult.message
            : "Registration failed."
        );
      }

      console.log("Register Result:", registerResult);

      setOtpSent(true);
      setTempdata({
        name: registerResult.name || "",
        city: registerResult.city || "",
        phone: registerResult.phone || "",
        receiverNetwork: registerResult.receiverNetwork || "",
        division: registerResult.division || "",
        farmsize: registerResult.farmsize || "",
        role: registerResult.role || "",
        country: registerResult.country || "",
      });
      setFullname(registerData.name);
    } catch (error) {
      const err = error as unknown; // ✅ Explicitly cast error
      setRegisterError(
        err instanceof Error
          ? err.message
          : "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegisterData({
      ...registerData,
      country: e.target.value,
      city: "", // Reset city when country changes
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegisterData({
      ...registerData,
      city: e.target.value,
    });
  };

  const selectedCountry = countries.find(
    (country) => country.value === registerData.country
  );

  return {
    isLoadingBoth,
    isLoadingOtp,
    activeTab,
    setActiveTab,
    loginData,
    setLoginData,
    registerData,
    setRegisterData,
    otp,
    setOtp,
    otpSent,
    handleRegister,
    handleLogin,
    errorState,
    showOtpPopup,
    setShowOtpPopup,
    verifyOtp,
    sendOtp,
    isLoadingBoth1,
    otperrorState,
    division1,
    fullname,
    handleCountryChange,
    handleCityChange,
    selectedCountry,
    registererrorState,
    setRegisterError,
  };
}
