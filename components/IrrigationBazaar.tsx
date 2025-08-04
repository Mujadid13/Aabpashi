"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useTranslations } from "next-intl";
import "swiper/css";
import "swiper/css/navigation";

const IrrigationBazaar: React.FC = () => {
  const t = useTranslations("bazaar");

  const localizedProducts = [
    { id: 1, key: "dripKit", image: "/placeholder-drip.png" },
    { id: 2, key: "solarPump", image: "/placeholder-pump.png" },
    { id: 3, key: "pipes", image: "/placeholder-pipes.png" },
    { id: 4, key: "nozzle", image: "/placeholder-nozzle.png" },
    { id: 5, key: "timer", image: "/placeholder-timer.png" },
    { id: 6, key: "sprinklers", image: "/placeholder-sprinkler.png" },
    { id: 7, key: "sensor", image: "/placeholder-sensor.png" },
    { id: 8, key: "hose", image: "/placeholder-hose.png" }
  ];

  return (
    <section className="bazaar-section">
      <h2 className="bazaar-heading">{t("title")}</h2>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 }
        }}
      >
        {localizedProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="bazaar-slide-card">
              <div className="bazaar-image-wrapper">
                <Image
                  src={product.image}
                  alt={t(`products.${product.key}.name`)}
                  fill
                  className="object-contain rounded-md"
                />
              </div>
              <h3 className="bazaar-product-title">
                {t(`products.${product.key}.name`)}
              </h3>
              <p className="bazaar-product-price">
                {t(`products.${product.key}.price`)}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default IrrigationBazaar;
