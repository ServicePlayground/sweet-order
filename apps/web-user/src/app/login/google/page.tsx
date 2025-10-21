"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGoogleLogin,
  useGoogleRegister,
} from "@/apps/web-user/features/auth/hooks/queries/useAuth";
import PhoneVerificationForm from "@/apps/web-user/features/auth/components/forms/PhoneVerificationForm";

export default function GoogleAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleLoginMutation = useGoogleLogin();
  const googleRegisterMutation = useGoogleRegister();

  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [googleData, setGoogleData] = useState<{
    googleId: string;
    googleEmail: string;
  } | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.push("/login");
      return;
    }
    handleGoogleCallback(code);
  }, [searchParams]);

  const handleGoogleCallback = async (code: string) => {
    try {
      await googleLoginMutation.mutateAsync(code);
      router.push("/");
    } catch (error: any) {
      const { googleId, googleEmail, message } = error?.response?.data?.data || {};

      if (message === "휴대폰 인증이 필요합니다.") {
        setGoogleData({ googleId, googleEmail });
        setShowPhoneVerification(true);
      } else {
        // 다른 오류의 경우 로그인 페이지로 이동
        router.push("/login");
      }
    }
  };

  const handlePhoneVerificationComplete = async (phone: string) => {
    if (!googleData) return;

    try {
      await googleRegisterMutation.mutateAsync({
        ...googleData,
        phone,
      });
      router.push("/");
    } catch (error) {
      console.error("구글 회원가입 실패:", error);
    }
  };

  // 휴대폰 인증이 필요한 경우
  if (showPhoneVerification) {
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
        <div>구글 계정으로 회원가입을 완료하려면 휴대폰 인증이 필요합니다.</div>
        <PhoneVerificationForm onVerificationComplete={handlePhoneVerificationComplete} />
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
