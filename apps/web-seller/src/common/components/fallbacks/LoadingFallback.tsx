"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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
      <div className="fixed bottom-5 right-5 bg-black/80 text-white p-3 rounded-lg z-[1000] flex items-center gap-2 shadow-lg">
        <Loader2 className="h-4 w-4 animate-spin" />
        <p className="text-sm font-medium">
          {message}
          {dots}
        </p>
      </div>
    );
  }

  // overlay variant (기본값)
  return (
    <div className="fixed inset-0 bg-white/90 flex flex-col items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-base font-medium text-foreground">
          {message}
          {dots}
        </p>
      </div>
    </div>
  );
}
