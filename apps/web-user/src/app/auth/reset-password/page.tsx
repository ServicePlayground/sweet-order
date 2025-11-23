"use client";

import { useState } from "react";
import Link from "next/link";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { useResetPassword } from "@/apps/web-user/features/auth/hooks/queries/useAuth";
import PhoneVerificationForm from "@/apps/web-user/features/auth/components/forms/PhoneVerificationForm";
import PasswordResetForm from "@/apps/web-user/features/auth/components/forms/PasswordResetForm";
import {
  ResetPasswordFormData,
  PHONE_VERIFICATION_PURPOSE,
} from "@/apps/web-user/features/auth/types/auth.type";

export default function ResetPasswordPage() {
  const resetPasswordMutation = useResetPassword();

  const [currentStep, setCurrentStep] = useState<"phoneVerification" | "passwordReset">(
    "phoneVerification",
  );
  const [phone, setPhone] = useState("");

  // 휴대폰 인증 완료 후 비밀번호 재설정 단계로 이동
  const handlePhoneVerificationComplete = async (verifiedPhone: string) => {
    setPhone(verifiedPhone);
    setCurrentStep("passwordReset");
  };

  // 비밀번호 재설정 처리
  const handleResetPassword = async (data: Omit<ResetPasswordFormData, "phone">) => {
    await resetPasswordMutation.mutateAsync({
      phone,
      userId: data.userId,
      newPassword: data.newPassword,
    });
  };

  // 비밀번호 재설정 단계
  if (currentStep === "passwordReset") {
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
            비밀번호 재설정
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
            새로운 비밀번호를 입력해주세요.
          </p>

          <PasswordResetForm
            onResetPassword={handleResetPassword}
            isPending={resetPasswordMutation.isPending}
          />

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
          비밀번호 찾기
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
          휴대폰 번호로 인증 후 비밀번호를 재설정할 수 있습니다.
        </p>

        <PhoneVerificationForm
          onVerificationComplete={handlePhoneVerificationComplete}
          purpose={PHONE_VERIFICATION_PURPOSE.PASSWORD_RECOVERY}
        />

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
