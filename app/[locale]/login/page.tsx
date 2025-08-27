"use client";
import { useAuthForms } from "@/hooks/useAuthForms";
import AuthTabs from "@/components/ui/AuthTabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function LoginPage() {
  const { isLoadingBoth, isLoadingOtp, activeTab, setActiveTab, loginData, setLoginData, registerData, setRegisterData, handleLogin, setOtp, otpSent, handleRegister,  otp,errorState, showOtpPopup, setShowOtpPopup, verifyOtp, sendOtp, isLoadingBoth1, otperrorState, handleCountryChange, handleCityChange, selectedCountry, registererrorState } = useAuthForms();


  return (
    <div className="login-page-container">
      <div className="login-form-container">
        
        {/* 🔹 Tabs (Login | Register) */}
        <AuthTabs activeTab={activeTab} setActiveTabAction={setActiveTab} />

        {/* 🔹 Show Form Based on Active Tab */}
        {activeTab === "login" ? (
          <LoginForm {...{ loginData, isLoadingBoth, isLoadingOtp, setLoginDataAction: setLoginData, handleLoginAction: handleLogin, otpSent, setOtpAction: setOtp, handleVerifyOtpAndRegisterAction: handleRegister, otp, errorState, showOtpPopup, setShowOtpPopupAction: setShowOtpPopup, verifyOtp, verifyOtpAction: verifyOtp, sendOtp, sendOtpAction: sendOtp, isLoadingBoth1, otperrorState }} />
        ) : (
          <RegisterForm {...{ registerData, isLoadingBoth ,isLoadingOtp, setRegisterDataAction: setRegisterData, setOtpAction: setOtp, otpSent, handleVerifyOtpAndRegisterAction: handleRegister, otp, handleRegisterAction: handleRegister, verifyOtpAction: verifyOtp, showOtpPopup, setShowOtpPopupAction: setShowOtpPopup, registererrorState, otperrorState, sendOtpAction: sendOtp, isLoadingBoth1, handleCountryChangeAction: handleCountryChange, handleCityChangeAction: handleCityChange, selectedCountry  }} />
        )}
      </div>
    </div>
  );
}