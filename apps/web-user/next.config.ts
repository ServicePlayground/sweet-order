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
  async redirects() {
    return [
      { source: "/login", destination: "/auth/login", permanent: true },
      { source: "/login/basic", destination: "/auth/login/basic", permanent: true },
      { source: "/login/google", destination: "/auth/login/google", permanent: true },
      { source: "/register/basic", destination: "/auth/register/basic", permanent: true },
      { source: "/find-account", destination: "/auth/find-account", permanent: true },
      { source: "/reset-password", destination: "/auth/reset-password", permanent: true },
    ];
  },
};

export default nextConfig;
