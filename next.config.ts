import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  images: {
    localPatterns: [
      { pathname: "/api/media/**" },
      { pathname: "/uploads/**" },
      { pathname: "/*.jpeg" },
      { pathname: "/*.jpg" },
      { pathname: "/*.png" },
      { pathname: "/*.webp" },
      { pathname: "/logo.png" },
      { pathname: "/sliders/**" },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    // Old /uploads/... URLs still resolve via the media API.
    return [
      {
        source: "/uploads/:publicId",
        destination: "/api/media/:publicId",
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
