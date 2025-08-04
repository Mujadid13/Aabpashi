import { useEffect, useRef, useState } from "react";
import { useManualLoader } from "@/context/ManualLoaderContext";
import { useInViewOnce } from "@/hooks/useInViewOnce";

export function useHeaderState() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useInViewOnce(headerRef);
  const { showLoader } = useManualLoader();

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = () => {
    showLoader();
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/682ddad54b9538190bc4aaf8/1irphtktk";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);
    console.log("Tawk.to script loaded");
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return {
    mobileMenuOpen,
    setMobileMenuOpen,
    isLargeScreen,
    headerRef,
    hasAnimated,
    handleLinkClick,
  };
}
