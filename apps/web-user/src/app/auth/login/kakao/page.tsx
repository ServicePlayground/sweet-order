"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/apps/web-user/features/auth/apis/auth.api";
import { useAuthStore } from "@/apps/web-user/common/store/auth.store";
import { AUTH_ERROR_MESSAGES } from "@/apps/web-user/features/auth/constants/auth.constant";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";

function KakaoAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const { showAlert } = useAlertStore();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.replace(PATHS.HOME);
      return;
    }

    const run = async () => {
      try {
        const data = await authApi.kakaoLogin(code);
        setAccessToken(data.accessToken);
        router.replace(PATHS.HOME);
      } catch (error: unknown) {
        const err = error as {
          response?: {
            data?: { data?: { kakaoId?: string; kakaoEmail?: string; message?: string } };
          };
        };
        const { kakaoId, kakaoEmail, message } = err?.response?.data?.data || {};

        if (
          message === AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED &&
          kakaoId &&
          kakaoEmail
        ) {
          const params = new URLSearchParams();
          params.set("kakaoId", kakaoId);
          params.set("kakaoEmail", kakaoEmail);
          router.replace(`${PATHS.AUTH.KAKAO_REGISTER}?${params.toString()}`);
        } else {
          router.replace(PATHS.HOME);
          showAlert({
            type: "error",
            title: "오류",
            message: getApiMessage.error(error),
          });
        }
      }
    };

    void run();
  }, [searchParams, router, setAccessToken, showAlert]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-50">
      <p className="text-sm text-gray-600">카카오 로그인 처리 중...</p>
    </div>
  );
}

export default function KakaoAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
          <p className="text-sm text-gray-600">로딩 중...</p>
        </div>
      }
    >
      <KakaoAuthCallbackContent />
    </Suspense>
  );
}
