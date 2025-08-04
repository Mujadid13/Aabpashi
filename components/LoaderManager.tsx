"use client";
import { useEffect } from "react";
import { useManualLoader } from "@/context/ManualLoaderContext";
import { usePathname } from "next/navigation";

export default function LoaderManager() {
  const { hideLoader } = useManualLoader();
  const pathname = usePathname();

  useEffect(() => {
    // Wait 2s minimum, then hide loader
    const timeout = setTimeout(() => {
      hideLoader();
    }, 2000); // adjust to your preference

    return () => clearTimeout(timeout);
  }, [pathname, hideLoader]);

  return null;
}
