"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { useFindAccount } from "@/apps/web-user/features/auth/hooks/queries/useAuth";
import PhoneVerificationForm from "@/apps/web-user/features/auth/components/forms/PhoneVerificationForm";

export default function FindAccountPage() {
  const router = useRouter();
  const findAccountMutation = useFindAccount();
  const [accountInfo, setAccountInfo] = useState<{ userId?: string; googleEmail?: string } | null>(
    null,
  );
  const [currentStep, setCurrentStep] = useState<"phoneVerification" | "result">(
    "phoneVerification",
  );

  // 휴대폰 인증 완료 후 계정 찾기 처리
  const handlePhoneVerificationComplete = async (phone: string) => {
      const result = await findAccountMutation.mutateAsync(phone);
      setAccountInfo(result);
      setCurrentStep("result");
  };

  const handleBackToLogin = () => {
    router.push(PATHS.AUTH.LOGIN);
  };

  // 결과 표시 단계
  if (currentStep === "result" && accountInfo) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "200px",
          gap: "20px",
          maxWidth: "500px",
          margin: "200px auto 0",
        }}
      >
        <h1>계정 찾기 결과</h1>

        <div
          style={{
            width: "100%",
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "600" }}>
            찾은 계정 정보
          </h2>

          {accountInfo.userId && (
            <div
              style={{
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: "white",
                borderRadius: "4px",
              }}
            >
              <strong>일반 로그인 계정:</strong> {accountInfo.userId}
            </div>
          )}

          {accountInfo.googleEmail && (
            <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "4px" }}>
              <strong>구글 로그인 계정:</strong> {accountInfo.googleEmail}
            </div>
          )}
        </div>

        <button
          onClick={handleBackToLogin}
          style={{
            width: "100%",
            height: "50px",
            border: "none",
            backgroundColor: "#000",
            color: "white",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          로그인 페이지로 이동
        </button>

        <Link
          href={PATHS.AUTH.LOGIN}
          style={{
            color: "#666",
            fontSize: "14px",
            textDecoration: "none",
            marginTop: "10px",
          }}
        >
          ← 로그인 페이지로 돌아가기
        </Link>
      </div>
    );
  }

  // 휴대폰 인증 단계
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "200px",
        gap: "20px",
        maxWidth: "500px",
        margin: "200px auto 0",
      }}
    >
      <h1>계정 찾기</h1>
      <p style={{ fontSize: "14px", color: "#666", textAlign: "center", marginBottom: "20px" }}>
        휴대폰 번호로 등록된 계정을 찾아드립니다.
      </p>

      <PhoneVerificationForm onVerificationComplete={handlePhoneVerificationComplete} />

      <Link
        href={PATHS.AUTH.LOGIN}
        style={{
          color: "#666",
          fontSize: "14px",
          textDecoration: "none",
          marginTop: "20px",
        }}
      >
        ← 로그인 페이지로 돌아가기
      </Link>
    </div>
  );
}
