"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import Image from "next/image";
import { leadershipTeamImages } from "@/data/teamLeader";
import { teamMemberImages } from "@/data/teamMembers";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function AboutUs() {
  const t = useTranslations("about");
  const team = useTranslations("team");

  const leaders = team.raw("leadership");
  const members = team.raw("members");
  const locale = useLocale();
  const isRTL = ["ur", "pa", "sd"].includes(locale);

  const {
    showPopup,
    userId,
    handleLogin,
    handleLogout,
    handleRegister,
    handleCancel,
    setShowPopup,
  } = useAuthHandlers();

  return (
    <div className="app-container-89">
      <Header
        userId={userId}
        handleLogout={handleLogout}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleCancel={handleCancel}
      />

      <div className="technology-section-56">
        <div className="hero-container-56">
          <div className="absolute inset-0">
            <Image
              src="https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1745612292/vecteezy_irrigation-water-flow-from-pipe-to-canal-for-agriculture-fields_17775417_meahgb.jpg"
              alt="About Us Hero Image"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="hero-overlay-56">
            <h1 className="hero-title-56">{t("title")}</h1>
            <p className="hero-breadcrumb-56">{t("breadcrumb")}</p>
          </div>
        </div>

        {/* About Us Section */}
        <div className="about-us-section-89">
          <div className="about-us-text-89">
            <h2
              className={`section-heading-89 ${isRTL ? "text-right" : ""}`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {t("heading")}
            </h2>

            <h1
              className={`section-title-89 ${isRTL ? "text-right" : ""}`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {t("sectionTitle")}
            </h1>
            <p className="section-description-89">{t("description")}</p>
          </div>

          <div className="youtube-wrapper-89">
            <div className="youtube-aspect-ratio-89">
              <iframe
                className="youtube-iframe-89"
                src="https://www.youtube.com/embed/4PdB1jfgbFY"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="team-section-89">
          <h2 className="section-heading-89">{t("teamTitle")}</h2>
          <h1 className="section-title-89">{t("teamSubtitle")}</h1>
          <h2 className="section-subheading-89">{t("leadership")}</h2>

          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            loop
            navigation
            modules={[Navigation]}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1440: { slidesPerView: 4 },
            }}
            className="team-slider-89"
          >
            {leaders.map((leader: any, index: number) => (
              <SwiperSlide key={index}>
                <div className="team-member-card-89">
                  <div className="team-member-image-container-89">
                    <Image
                      src={leadershipTeamImages[index]}
                      alt={leader.name}
                      width={128}
                      height={128}
                      className="team-member-image-89"
                    />
                  </div>
                  <h3 className="team-member-name-89">{leader.name}</h3>
                  <h4 className="team-member-title-89">{leader.title}</h4>
                  <p className="team-member-description-89">
                    {leader.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <h2 className="section-subheading-89">{t("members")}</h2>

          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            loop
            navigation
            modules={[Navigation]}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1440: { slidesPerView: 4 },
            }}
            className="team-slider-89"
          >
            {members.map((member: any, index: number) => (
              <SwiperSlide key={index}>
                <div className="team-member-card-89">
                  <div className="team-member-image-container-89">
                    <Image
                      src={teamMemberImages[index]}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="team-member-image-89"
                    />
                  </div>
                  <h3 className="team-member-name-89">{member.name}</h3>
                  <h4 className="team-member-title-89">{member.title}</h4>
                  <p className="team-member-description-89">
                    {member.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <Footer />
    </div>
  );
}
