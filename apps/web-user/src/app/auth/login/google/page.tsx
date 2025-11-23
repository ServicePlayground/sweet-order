"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGoogleLogin,
  useGoogleRegister,
} from "@/apps/web-user/features/auth/hooks/queries/useAuth";
import PhoneVerificationForm from "@/apps/web-user/features/auth/components/forms/PhoneVerificationForm";
import {
  GoogleLoginFormData,
  PHONE_VERIFICATION_PURPOSE,
} from "@/apps/web-user/features/auth/types/auth.type";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";

export default function GoogleAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleLoginMutation = useGoogleLogin();
  const googleRegisterMutation = useGoogleRegister();
  const { showAlert } = useAlertStore();

  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [googleLoginData, setGoogleLoginData] = useState<GoogleLoginFormData | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.push(PATHS.HOME);
      return;
    }
    handleGoogleCallback(code);
  }, [searchParams]);

  const handleGoogleCallback = async (code: string) => {
    // 특별한 비즈니스 로직(휴대폰 인증 필요)이 있으므로 try-catch 유지
    try {
      await googleLoginMutation.mutateAsync(code);
    } catch (error: any) {
      const { googleId, googleEmail, message } = error?.response?.data?.data || {};

      if (message === "휴대폰 인증이 필요합니다.") {
        setGoogleLoginData({ googleId, googleEmail });
        setShowPhoneVerification(true);
      } else {
        // 다른 오류의 경우 로그인 페이지로 이동
        router.push(PATHS.HOME);
        showAlert({
          type: "error",
          title: "오류",
          message: getApiMessage.error(error),
        });
      }
    }
  };

  const handlePhoneVerificationComplete = async (phone: string) => {
    if (!googleLoginData) return;

    await googleRegisterMutation.mutateAsync({
      ...googleLoginData,
      phone,
    });
  };

  // 휴대폰 인증이 필요한 경우
  if (showPhoneVerification) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "100vh",
          padding: "40px 20px",
          backgroundColor: "#fafafa",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div>구글 계정으로 회원가입을 완료하려면 휴대폰 인증이 필요합니다.</div>
          <PhoneVerificationForm
            onVerificationComplete={handlePhoneVerificationComplete}
            purpose={PHONE_VERIFICATION_PURPOSE.GOOGLE_REGISTRATION}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div>구글 로그인 처리 중...</div>
      {googleLoginMutation.isPending && <div>잠시만 기다려주세요.</div>}
    </div>
  );
}
