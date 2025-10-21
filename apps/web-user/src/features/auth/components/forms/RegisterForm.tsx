"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/apps/web-user/common/components/inputs/Input";
import { Button } from "@/apps/web-user/common/components/buttons/Button";
import {
  useRegister,
  useCheckUserIdDuplicate,
} from "@/apps/web-user/features/auth/hooks/queries/useAuth";
import { AUTH_ERROR_MESSAGES } from "@/apps/web-user/features/auth/constants/auth.constant";
import { isValidPassword, isValidUserId } from "@/apps/web-user/common/utils/validator.util";
import PhoneVerificationForm from "./PhoneVerificationForm";

export default function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const checkUserIdDuplicateMutation = useCheckUserIdDuplicate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isUserIdAvailable, setIsUserIdAvailable] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<"register" | "phoneVerification">("register");

  const handleChangeUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserId(value);
    setIsUserIdAvailable(false); // 아이디 변경 시 중복 확인 상태 초기화

    if (!isValidUserId(value)) {
      setUserIdError(AUTH_ERROR_MESSAGES.USER_ID_INVALID_FORMAT);
      return;
    }

    setUserIdError("");
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (!isValidPassword(value)) {
      setPasswordError(AUTH_ERROR_MESSAGES.PASSWORD_INVALID_FORMAT);
      return;
    }

    setPasswordError("");
  };

  // 아이디 중복 확인
  const handleCheckUserIdDuplicate = async () => {
    const result = await checkUserIdDuplicateMutation.mutateAsync(userId);
    setIsUserIdAvailable(result.available);
    result.available
      ? setUserIdError(AUTH_ERROR_MESSAGES.USER_ID_AVAILABLE)
      : setUserIdError(AUTH_ERROR_MESSAGES.USER_ID_ALREADY_EXISTS);
  };

  // 다음 단계로 이동 (휴대폰 인증)
  const handleNext = () => {
    setCurrentStep("phoneVerification");
  };

  // 휴대폰 인증 완료 후 회원가입 처리
  const handlePhoneVerificationComplete = async (phone: string) => {
    await registerMutation.mutateAsync({ userId, password, phone });
    router.push("/");
  };

  // 휴대폰 인증 단계
  if (currentStep === "phoneVerification") {
    return <PhoneVerificationForm onVerificationComplete={handlePhoneVerificationComplete} />;
  }

  // 회원가입 정보 입력 단계
  return (
    <form>
      <div style={{ display: "flex", gap: "10px" }}>
        <Input
          label="아이디"
          type="text"
          name="userId"
          value={userId}
          onChange={handleChangeUserId}
          error={userIdError}
        />
        <Button
          type="button"
          onClick={handleCheckUserIdDuplicate}
          disabled={!userId || !!userIdError}
        >
          {"중복확인"}
        </Button>
      </div>

      <Input
        label="비밀번호"
        type="password"
        name="password"
        value={password}
        onChange={handleChangePassword}
        error={passwordError}
      />

      <Button
        type="button"
        onClick={handleNext}
        disabled={!userId || !password || !!userIdError || !!passwordError || !isUserIdAvailable}
        style={{ marginTop: "10px", width: "100%", height: "40px" }}
      >
        {"다음"}
      </Button>
    </form>
  );
}
