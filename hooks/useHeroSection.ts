import { useRef } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { useManualLoader } from "@/context/ManualLoaderContext";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

interface UseHeroSectionProps {
  userId: string | null;
}

export function useHeroSection(props: UseHeroSectionProps) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useInViewOnce(sectionRef);
  const { showLoader } = useManualLoader();
  const t = useTranslations("home");
  const locale = useLocale();

  const handleStartMonitoring = () => {
    showLoader();
    if (props.userId) {
    router.push(`/${locale}/field-mapping`);
  } else {
    router.push(`/${locale}/login`);
  }
  };
  return { sectionRef, hasAnimated, showLoader, handleStartMonitoring, t };
}
