import { useRef } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { useManualLoader } from "@/context/ManualLoaderContext";
import { useRouter } from "next/navigation";

export function useFooterAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useInViewOnce(ref);
  const { showLoader } = useManualLoader();
  const router = useRouter();
  return { ref, hasAnimated, showLoader, router };
}
