"use client";

import { useEffect, useState } from "react";

interface LoadingFallbackProps {
  variant?: "overlay" | "corner";
  message?: string;
}

export function LoadingFallback({
  variant = "overlay",
  message = "로딩 중...",
}: LoadingFallbackProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (variant === "corner") {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "12px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="loading-spinner-small" />
        <span>
          {message}
          {dots}
        </span>
      </div>
    );
  }

  // overlay variant (기본값)
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* 로딩 스피너 */}
        <div className="loading-spinner-large" />

        {/* 로딩 메시지 */}
        <div
          style={{
            fontSize: "16px",
            fontWeight: "500",
            color: "#374151",
            textAlign: "center",
          }}
        >
          {message}
          {dots}
        </div>
      </div>
    </div>
  );
}
