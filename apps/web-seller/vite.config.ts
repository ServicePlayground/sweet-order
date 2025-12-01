/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
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
