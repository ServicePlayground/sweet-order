"use client";

import { useState } from "react";
import { Input } from "@/apps/web-user/common/components/inputs/Input";
import { Button } from "@/apps/web-user/common/components/buttons/Button";
import {
  useSendPhoneVerification,
  useVerifyPhoneCode,
} from "@/apps/web-user/features/auth/hooks/queries/useAuth";
import { AUTH_ERROR_MESSAGES } from "@/apps/web-user/features/auth/constants/auth.constant";
import { isValidPhone, isValidVerificationCode } from "@/apps/web-user/common/utils/validator.util";

interface PhoneVerificationFormProps {
  onVerificationComplete: (phone: string) => void;
}

export default function PhoneVerificationForm({
  onVerificationComplete,
}: PhoneVerificationFormProps) {
  const sendPhoneVerificationMutation = useSendPhoneVerification();
  const verifyPhoneCodeMutation = useVerifyPhoneCode();

  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [verificationCodeError, setVerificationCodeError] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  // 숫자만 입력 허용하는 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 허용
    setPhone(value);
    setIsCodeSent(false);

    if (!isValidPhone(value)) {
      setPhoneError(AUTH_ERROR_MESSAGES.PHONE_INVALID_FORMAT);
      return;
    }

    setPhoneError("");
  };

  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 허용
    setVerificationCode(value);

    if (!isValidVerificationCode(value)) {
      setVerificationCodeError(AUTH_ERROR_MESSAGES.VERIFICATION_CODE_INVALID_FORMAT);
      return;
    }

    setVerificationCodeError("");
  };

  // 인증번호 발송
  const handleSendVerificationCode = async () => {
    await sendPhoneVerificationMutation.mutateAsync(phone);
    setIsCodeSent(true);
  };

  // 인증번호 검증
  const handleVerifyCode = async () => {
    await verifyPhoneCodeMutation.mutateAsync({
      phone,
      verificationCode,
    });
    onVerificationComplete(phone);
  };

  return (
    <form style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          <Input
            label="휴대폰번호"
            type="tel"
            name="phone"
            value={phone}
            onChange={handlePhoneChange}
            error={phoneError}
            placeholder="01012345678"
            maxLength={11}
          />
        </div>
        <Button
          type="button"
          onClick={handleSendVerificationCode}
          disabled={!phone || !!phoneError || sendPhoneVerificationMutation.isPending}
          style={{
            minWidth: "120px",
            height: "48px",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          {sendPhoneVerificationMutation.isPending ? "발송 중..." : "인증번호 발송"}
        </Button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Input
          label="인증번호"
          type="text"
          name="verificationCode"
          value={verificationCode}
          onChange={handleVerificationCodeChange}
          error={verificationCodeError}
          placeholder="123456"
          maxLength={6}
        />
      </div>

      <Button
        type="button"
        disabled={
          !phone ||
          !verificationCode ||
          !!phoneError ||
          !!verificationCodeError ||
          !isCodeSent ||
          verifyPhoneCodeMutation.isPending
        }
        onClick={handleVerifyCode}
        style={{
          width: "100%",
          height: "48px",
          borderRadius: "6px",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        {verifyPhoneCodeMutation.isPending ? "인증 중..." : "인증 완료"}
      </Button>
    </form>
  );
}
