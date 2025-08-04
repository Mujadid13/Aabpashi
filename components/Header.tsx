"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

import UserProfile from "./UserProfile";
import AuthPopup from "./auth/AuthPopup";
import { useHeaderState } from "@/hooks/useHeaderState";
import navItems from "@/data/headernav";


interface HeaderProps {
  userId: string | null;
  handleLogout: () => void;
  setShowPopup: (value: boolean) => void;
  showPopup: boolean;
  handleLogin: () => void;
  handleRegister: () => void;
  handleCancel: () => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  const t = useTranslations("header.nav");
  const pathname = usePathname();
  const localePrefix = pathname.split("/")[1] || "en";
  const isUrdu = localePrefix === "ur";

  const {
    mobileMenuOpen,
    setMobileMenuOpen,
    isLargeScreen,
    headerRef,
    hasAnimated,
    handleLinkClick,
  } = useHeaderState();

  return (
    <>
      <nav ref={headerRef} className="header-wrapper">
        <div className="header-container">
          {/* Logo */}
          <motion.div
            className="flex items-center flex-shrink-0"
            whileHover={{ rotateY: 15, scale: 1.1 }}
            whileTap={{ rotateY: -15, scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={hasAnimated ? { opacity: 1 } : {}}
            transition={{ delay: 0.1 }}
          >
            <Link href={`/${localePrefix}`} onClick={handleLinkClick}>
              <Image
                src="https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1746126580/logo-icon_tfghku.png"
                alt="Farmovation Logo"
                width={100}
                height={100}
                className="logo-img"
              />
            </Link>
          </motion.div>

          {/* Nav Links */}
          <div className={`nav-links ${isUrdu ? "rtl-nav-links" : ""}`}>
            {navItems.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0 }}
                animate={hasAnimated ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={`/${localePrefix}${item.path}`}
                  onClick={handleLinkClick}
                  className="nav-link"
                >
                  {t(item.key)}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Profile (desktop) */}
          {isLargeScreen && (
            <div className="desktop-profile">
              <UserProfile
                userId={props.userId}
                handleLogoutAction={props.handleLogout}
                setShowPopupAction={props.setShowPopup}
                mobileMenuOpen={mobileMenuOpen}
                showPopup={props.showPopup}
              />
            </div>
          )}

          {/* Mobile menu toggle */}
          <motion.button
            className="menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={hasAnimated ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            ☰
          </motion.button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ x: isUrdu ? 250 : -250 }}
              animate={{ x: 0 }}
              exit={{ x: isUrdu ? 250 : -250 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mobile-logo">
                <Link href={`/${localePrefix}`} onClick={handleLinkClick}>
                  <Image
                    src="https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1746126580/logo-icon_tfghku.png"
                    alt="Farmovation Logo"
                    width={80}
                    height={80}
                  />
                </Link>
              </div>

              <div className="mobile-divider"></div>

              <div className="mobile-nav-list">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.key}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <Link
                      href={`/${localePrefix}${item.path}`}
                      onClick={() => {
                        handleLinkClick();
                        setMobileMenuOpen(false);
                      }}
                      className="mobile-nav-link"
                    >
                      {t(item.key)}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mobile-footer">
                <UserProfile
                  userId={props.userId}
                  handleLogoutAction={props.handleLogout}
                  setShowPopupAction={props.setShowPopup}
                  mobileMenuOpen={mobileMenuOpen}
                  showPopup={props.showPopup}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Auth Popup */}
      <AnimatePresence>
        {props.showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <AuthPopup
              handleLoginAction={props.handleLogin}
              handleRegisterAction={props.handleRegister}
              handleCancelAction={props.handleCancel}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
