import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lvakbdjxsybbhuymuaha.supabase.co",
      },
    ],
  },
};

export default nextConfig;
