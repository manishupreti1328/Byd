import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "backend.bydcarupdates.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "bydcarupdates.com",
        pathname: "/**",
      },
    ],
  },

  async redirects() {
    return [
      {
        // OLD → NEW (Fangchengbao Tai 3)
        source: "/models/fangchengbao-tai-3-byd-offroad-ev-review",
        destination: "/models/fangchengbao-tai-3",
        permanent: true, // 301
      },
      {
        // OLD → NEW (BYD Dolphin 2026)
        source: "/models/byd-dolphin-2026-electric-car-review",
        destination: "/models/byd-dolphin",
        permanent: true, // 301
      },
      {
        // OLD → NEW (BYD Seagull)
        source: "/models/byd-seagull-price-range-vs-dolphin",
        destination: "/models/byd-seagull",
        permanent: true, // 301
      },
      {
        // OLD → NEW (Denza N9)
        source: "/models/denza-n9-price-interior-luxury-electric-suv-range",
        destination: "/models/denza-n9",
        permanent: true, // 301
      },

      // ➕ ADD MORE REDIRECTS BELOW
      // {
      //   source: "/old-url",
      //   destination: "/new-url",
      //   permanent: true,
      // },
    ];
  },
};

export default nextConfig;
