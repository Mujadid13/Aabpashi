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

  return {
    mobileMenuOpen,
    setMobileMenuOpen,
    isLargeScreen,
    headerRef,
    hasAnimated,
    handleLinkClick,
  };
}
