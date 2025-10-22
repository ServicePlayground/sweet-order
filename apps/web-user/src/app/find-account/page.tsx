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
          <h1
            style={{
              textAlign: "center",
              marginBottom: "32px",
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            계정 찾기 결과
          </h1>

          <div
            style={{
              width: "100%",
              textAlign: "center",
              padding: "24px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <h2
              style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "600", color: "#333" }}
            >
              찾은 계정 정보
            </h2>

            {accountInfo.userId && (
              <div
                style={{
                  marginBottom: "12px",
                  padding: "16px",
                  backgroundColor: "white",
                  borderRadius: "6px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <strong style={{ color: "#333" }}>일반 로그인 계정:</strong>
                <span style={{ marginLeft: "8px", color: "#666" }}>{accountInfo.userId}</span>
              </div>
            )}

            {accountInfo.googleEmail && (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "white",
                  borderRadius: "6px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <strong style={{ color: "#333" }}>구글 로그인 계정:</strong>
                <span style={{ marginLeft: "8px", color: "#666" }}>{accountInfo.googleEmail}</span>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px", width: "100%" }}>
            <button
              onClick={handleBackToLogin}
              style={{
                flex: 1,
                height: "48px",
                border: "none",
                backgroundColor: "#000",
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                borderRadius: "6px",
              }}
            >
              로그인 페이지로 이동
            </button>

            {accountInfo.userId && (
              <Link
                href={PATHS.AUTH.RESET_PASSWORD}
                style={{
                  flex: 1,
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f8f9fa",
                  color: "#000",
                  fontSize: "16px",
                  fontWeight: "600",
                  textDecoration: "none",
                  borderRadius: "6px",
                  border: "1px solid #e0e0e0",
                }}
              >
                비밀번호 재설정
              </Link>
            )}
          </div>

          <Link
            href={PATHS.AUTH.LOGIN}
            style={{
              color: "#666",
              fontSize: "14px",
              textDecoration: "none",
              marginTop: "16px",
              textAlign: "center",
            }}
          >
            ← 로그인 페이지로 돌아가기
          </Link>
        </div>
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
        <h1
          style={{ textAlign: "center", marginBottom: "32px", fontSize: "24px", fontWeight: "600" }}
        >
          계정 찾기
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            textAlign: "center",
            marginBottom: "32px",
            lineHeight: "1.5",
          }}
        >
          휴대폰 번호로 등록된 계정을 찾아드립니다.
        </p>

        <PhoneVerificationForm onVerificationComplete={handlePhoneVerificationComplete} />

        <Link
          href={PATHS.AUTH.LOGIN}
          style={{
            color: "#666",
            fontSize: "14px",
            textDecoration: "none",
            marginTop: "24px",
            textAlign: "center",
            display: "block",
          }}
        >
          ← 로그인 페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
}
