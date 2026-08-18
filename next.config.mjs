import withSerwistInit from "@serwist/next";
import createNextIntlPlugin from "next-intl/plugin";

// @serwist/next's Turbopack warning fires on every production build even when
// `disable` is correctly configured, since it only checks truthiness of `disable`.
// See https://github.com/serwist/serwist/issues/54
process.env.SERWIST_SUPPRESS_TURBOPACK_WARNING = "1";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "farmovationpakistan.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "openweathermap.org",
        pathname: "/img/wn/**",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
        pathname: "/dms/image/**",
      },
    ],
  },
  reactStrictMode: false,
};

export default withNextIntl(withSerwist(nextConfig));
