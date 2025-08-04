"use client";

import { motion } from "framer-motion";
import { useUserProfile } from "@/hooks/useUserProfile";
import { User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

interface UserProfileProps {
  handleLogoutAction: () => void;
  userId: string | null;
  setShowPopupAction: (value: boolean) => void;
  mobileMenuOpen: boolean;
  showPopup: boolean;
}

const UserProfile: React.FC<UserProfileProps> = (props) => {
  const t = useTranslations("userProfile");
  const locale = useLocale();

  const {
    profileMenuOpen,
    setProfileMenuOpen,
    handleDiscoverClick,
    profileRef,
    hasAnimated,
    fullname,
    translatedName,
    showUpdateModal,
    setShowUpdateModal,
    metaData,
  } = useUserProfile(props.showPopup, props.setShowPopupAction);

  const displayName = locale === "ur" ? translatedName : fullname;

  const desktopButton = (
    <motion.button
      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
      className="btn-desktop"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={hasAnimated ? { opacity: 1 } : {}}
      transition={{ delay: 0.1 }}
      title="User Menu"
    >
      <User className="w-4 h-4" />
      <span className="hidden md:inline">{displayName}</span>
    </motion.button>
  );

  const drawerCard = (
    <div className="card-wrapper">
      <motion.button
        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
        className="btn-mobile"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={hasAnimated ? { opacity: 1 } : {}}
        transition={{ delay: 0.1 }}
      >
        <User className="w-5 h-5" />
        <span className="text-sm font-semibold">{displayName}</span>
      </motion.button>
    </div>
  );

  return (
    <div ref={profileRef} className="profile-wrapper">
      {props.userId ? (
        <>
          {props.mobileMenuOpen ? drawerCard : desktopButton}

          {profileMenuOpen && (
            <motion.div
              className={`menu-container ${
                props.mobileMenuOpen ? "bottom-16" : "top-14"
              } right-0`}
              initial={{ opacity: 0 }}
              animate={hasAnimated ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                onClick={() => setShowUpdateModal(true)}
                className="menu-btn menu-btn-update"
                whileHover={{ scale: 1.01 }}
              >
                {t("view")}
              </motion.button>
               <motion.button
                onClick={() => setShowUpdateModal(true)}
                className="menu-btn menu-btn-update"
                whileHover={{ scale: 1.01 }}
              >
                {t("update")}
              </motion.button>
              <motion.button
                onClick={props.handleLogoutAction}
                className="menu-btn menu-btn-logout"
                whileHover={{ scale: 1.01 }}
              >
                {t("logout")}
              </motion.button>
            </motion.div>
          )}

          {showUpdateModal && metaData && (
            <div className="complaint-modal-overlay">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="complaint-modal-container"
              >
                <h2 className="text-xl font-bold text-center mb-6 tracking-wide">
                  ✨ Profile
                </h2>

                <form className="space-y-4 text-sm font-medium">
                  {["name", "phone", "city", "country", "division", "farmsize", "role"].map((key) => (
                    <div key={key}>
                      <label className="block mb-1 text-white/80">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      <input
                        type="text"
                        readOnly
                        defaultValue={metaData[key] || ""}
                        className="w-full px-4 py-2 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none cursor-default"
                      />
                    </div>
                  ))}
                </form>

                <div className="flex justify-end gap-3 pt-6">
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition text-white font-semibold shadow-md"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </>
      ) : (
        <motion.button
          onClick={handleDiscoverClick}
          className="btn-discover"
          initial={{ opacity: 0 }}
          animate={hasAnimated ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t("discover")}
        </motion.button>
      )}
    </div>
  );
};

export default UserProfile;
