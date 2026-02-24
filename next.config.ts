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
        // NEW → OLD (Fangchengbao Tai 3)
        source: "/models/fangchengbao-tai-3",
        destination: "/models/fangchengbao-tai-3-byd-offroad-ev-review",
        permanent: true,
      },
      {
        // NEW → OLD (BYD Dolphin 2026)
        source: "/models/byd-dolphin",
        destination: "/models/byd-dolphin-2026-electric-car-review",
        permanent: true,
      },
      {
        // NEW → OLD (BYD Seagull)
        source: "/models/byd-seagull",
        destination: "/models/byd-seagull-price-range-vs-dolphin",
        permanent: true,
      },
      {
        // NEW → OLD (Denza N9)
        source: "/models/denza-n9",
        destination: "/models/denza-n9-price-interior-luxury-electric-suv-range",
        permanent: true,
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
