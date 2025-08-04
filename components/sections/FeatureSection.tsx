"use client";

import FeatureCard from "../ui/FeatureCard";
import features from "@/data/features.json";
import { useTranslations } from "next-intl";

export default function FeaturesSection() {
  const t = useTranslations("featuresSection");

  return (
    <section className="features-section">
      <h2 className="features-heading">{t("heading")}</h2>
      <div className="features-grid">
        {features.map((feature, index) => {
          const title = t(`features.${feature.key}.title`);
          const description = t(`features.${feature.key}.description`);
          return (
            <FeatureCard key={index} title={title} description={description} />
          );
        })}
      </div>
    </section>
  );
}
