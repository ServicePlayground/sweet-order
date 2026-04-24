"use client";

import { Suspense } from "react";
import { GoogleRegisterVerificationScreen } from "@/apps/web-user/features/auth/components/GoogleRegisterVerificationScreen";

export default function GoogleRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-white">
          <p className="text-sm text-gray-600">불러오는 중...</p>
        </div>
      }
    >
      <GoogleRegisterVerificationScreen />
    </Suspense>
  );
}
