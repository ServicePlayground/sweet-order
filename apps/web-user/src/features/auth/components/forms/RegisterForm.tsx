"use client";

import { useState } from "react";
import { Input } from "@/apps/web-user/common/components/inputs/Input";
import { Button } from "@/apps/web-user/common/components/buttons/Button";
import { useRegister } from "@/apps/web-user/features/auth/hooks/queries/useAuth";
import { AUTH_ERROR_MESSAGES } from "@/apps/web-user/features/auth/constants/auth.constant";
import { isValidPassword } from "@/apps/web-user/common/utils/validator.util";
import PhoneVerificationForm from "@/apps/web-user/features/auth/components/forms/PhoneVerificationForm";
import UserIdCheckForm from "@/apps/web-user/features/auth/components/forms/UserIdCheckForm";
import { PHONE_VERIFICATION_PURPOSE } from "@/apps/web-user/features/auth/types/auth.type";

export default function RegisterForm() {
  const registerMutation = useRegister();

  const [userId, setUserId] = useState("");
  const [isUserIdAvailable, setIsUserIdAvailable] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [currentStep, setCurrentStep] = useState<"register" | "phoneVerification">("register");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (!isValidPassword(value)) {
      setPasswordError(AUTH_ERROR_MESSAGES.PASSWORD_INVALID_FORMAT);
      return;
    }

    setPasswordError("");
  };

  // 다음 단계로 이동 (휴대폰 인증)
  const handleNext = () => {
    setCurrentStep("phoneVerification");
  };

  // 휴대폰 인증 완료 후 회원가입 처리
  const handlePhoneVerificationComplete = async (phone: string) => {
    await registerMutation.mutateAsync({ userId, password, phone });
  };

  // 휴대폰 인증 단계
  if (currentStep === "phoneVerification") {
    return (
      <PhoneVerificationForm
        onVerificationComplete={handlePhoneVerificationComplete}
        purpose={PHONE_VERIFICATION_PURPOSE.REGISTRATION}
      />
    );
  }

  const isFormValid =
    userId && password && !passwordError && isUserIdAvailable && !registerMutation.isPending;

  // 회원가입 정보 입력 단계
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
      <UserIdCheckForm
        userId={userId}
        isUserIdAvailable={isUserIdAvailable}
        setUserId={setUserId}
        setIsUserIdAvailable={setIsUserIdAvailable}
      />

      <Input
        label="비밀번호"
        type="password"
        name="password"
        value={password}
        onChange={handlePasswordChange}
        error={passwordError}
        placeholder="비밀번호를 입력하세요"
      />

      <Button
        type="button"
        onClick={handleNext}
        disabled={!isFormValid}
        style={{ width: "100%", height: "48px", borderRadius: "6px" }}
      >
        {registerMutation.isPending ? "회원가입 중..." : "다음"}
      </Button>
    </div>
  );
}
