/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  define: {
    /** Vercel 빌드 시 자동으로 설정되는 커밋 전체 SHA */
    "import.meta.env.VITE_PUBLIC_VERCEL_GIT_COMMIT_SHA": JSON.stringify(
      process.env.VERCEL_GIT_COMMIT_SHA ?? "",
    ),
    /** GitHub Actions가 자동으로 설정하는 커밋 SHA */
    "import.meta.env.VITE_PUBLIC_GITHUB_SHA": JSON.stringify(process.env.GITHUB_SHA ?? ""),
    /** GitHub Actions가 자동으로 설정하는 브랜치·태그 이름 */
    "import.meta.env.VITE_PUBLIC_GITHUB_REF_NAME": JSON.stringify(process.env.GITHUB_REF_NAME ?? ""),
  },
  resolve: {
    alias: {
      "@/apps/web-seller": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3002,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
