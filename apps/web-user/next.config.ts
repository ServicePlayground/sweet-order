import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLint 검사를 비활성화하고 루트(yarn run common:lint)에서 별도로 실행
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static-staging.sweetorders.com",
      },
      {
        protocol: "https",
        hostname: "static.sweetorders.com",
      },
    ],
  },
};

export default nextConfig;
