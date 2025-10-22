"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import {
  useSendPhoneVerification,
  useVerifyPhoneCode,
  useResetPassword,
} from "@/apps/web-user/features/auth/hooks/queries/useAuth";
import PhoneVerificationForm from "@/apps/web-user/features/auth/components/forms/PhoneVerificationForm";
import { Input } from "@/apps/web-user/common/components/inputs/Input";
import { Button } from "@/apps/web-user/common/components/buttons/Button";
import { AUTH_ERROR_MESSAGES } from "@/apps/web-user/features/auth/constants/auth.constant";
import { isValidUserId, isValidPassword } from "@/apps/web-user/common/utils/validator.util";

export default function ResetPasswordPage() {
  const router = useRouter();
  const sendPhoneVerificationMutation = useSendPhoneVerification();
  const verifyPhoneCodeMutation = useVerifyPhoneCode();
  const resetPasswordMutation = useResetPassword();

  const [currentStep, setCurrentStep] = useState<"phoneVerification" | "passwordReset">(
    "phoneVerification",
  );
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // 휴대폰 인증 완료 후 비밀번호 재설정 단계로 이동
  const handlePhoneVerificationComplete = async (verifiedPhone: string) => {
    setPhone(verifiedPhone);
    setCurrentStep("passwordReset");
  };

  // 사용자 ID 유효성 검사
  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserId(value);

    if (!isValidUserId(value)) {
      setUserIdError(AUTH_ERROR_MESSAGES.USER_ID_INVALID_FORMAT);
      return;
    }

    setUserIdError("");
  };

  // 새 비밀번호 유효성 검사
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);

    if (!isValidPassword(value)) {
      setPasswordError(AUTH_ERROR_MESSAGES.PASSWORD_INVALID_FORMAT);
      return;
    }

    setPasswordError("");
  };

  // 비밀번호 확인 유효성 검사
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== newPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setConfirmPasswordError("");
  };

  // 비밀번호 재설정 처리
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        phone,
        userId,
        newPassword,
      });

      alert("비밀번호가 성공적으로 재설정되었습니다.");
      router.push(PATHS.AUTH.LOGIN);
    } catch (error) {
      console.error("비밀번호 재설정 실패:", error);
    }
  };

  const handleBackToLogin = () => {
    router.push(PATHS.AUTH.LOGIN);
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

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
            <Input
              label="사용자 ID"
              type="text"
              name="userId"
              value={userId}
              onChange={handleUserIdChange}
              error={userIdError}
              placeholder="사용자 ID를 입력하세요"
            />

            <Input
              label="새 비밀번호"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              error={passwordError}
              placeholder="새 비밀번호를 입력하세요"
            />

            <Input
              label="비밀번호 확인"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={confirmPasswordError}
              placeholder="비밀번호를 다시 입력하세요"
            />

            <Button
              type="button"
              disabled={
                !userId ||
                !newPassword ||
                !confirmPassword ||
                !!userIdError ||
                !!passwordError ||
                !!confirmPasswordError ||
                resetPasswordMutation.isPending
              }
              onClick={handleResetPassword}
              style={{ width: "100%", height: "48px", borderRadius: "6px" }}
            >
              {resetPasswordMutation.isPending ? "처리 중..." : "비밀번호 재설정"}
            </Button>
          </div>

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
