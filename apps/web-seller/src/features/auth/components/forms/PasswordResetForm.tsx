import { useState } from "react";
import { Input } from "@/apps/web-seller/common/components/inputs/Input";
import { Button } from "@/apps/web-seller/common/components/buttons/Button";
import { AUTH_ERROR_MESSAGES } from "@/apps/web-seller/features/auth/constants/auth.constant";
import { isValidUserId, isValidPassword } from "@/apps/web-seller/common/utils/validator.util";
import { ResetPasswordFormData } from "../../types/auth.type";

interface PasswordResetFormProps {
  onResetPassword: (data: Omit<ResetPasswordFormData, "phone">) => Promise<void>;
  isPending?: boolean;
}

export default function PasswordResetForm({
  onResetPassword,
  isPending = false,
}: PasswordResetFormProps) {
  const [userId, setUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

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
      setConfirmPasswordError(AUTH_ERROR_MESSAGES.PASSWORD_NOT_MATCHED);
      return;
    }

    setConfirmPasswordError("");
  };

  // 비밀번호 재설정 처리
  const handleSubmit = async () => {
    await onResetPassword({
      userId,
      newPassword,
    });
  };

  const isFormValid =
    userId &&
    newPassword &&
    confirmPassword &&
    !userIdError &&
    !passwordError &&
    !confirmPasswordError;

  return (
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
        disabled={!isFormValid || isPending}
        onClick={handleSubmit}
        style={{ width: "100%", height: "48px", borderRadius: "6px" }}
      >
        {isPending ? "처리 중..." : "비밀번호 재설정"}
      </Button>
    </div>
  );
}
