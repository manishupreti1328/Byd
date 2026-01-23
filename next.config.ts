// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**res.cloudinary.com",
      },
      // Add your WordPress backend domain here
      {
        protocol: "https",
        hostname: "backend.bydcarupdates.com",
        pathname: "/wp-content/uploads/**",
      },
      // Also add your main domain for future use
      {
        protocol: "https",
        hostname: "bydcarupdates.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;