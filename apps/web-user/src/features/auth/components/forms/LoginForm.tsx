"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/apps/web-user/common/components/inputs/Input";
import { Button } from "@/apps/web-user/common/components/buttons/Button";
import { useLogin } from "@/apps/web-user/features/auth/hooks/queries/useAuth";
import { AUTH_ERROR_MESSAGES } from "@/apps/web-user/features/auth/constants/auth.constant";
import { isValidPassword, isValidUserId } from "@/apps/web-user/common/utils/validator.util";

export default function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChangeUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserId(value);

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

  // 6) 제출
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await loginMutation.mutateAsync({ userId, password });
    router.push("/");
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        label="아이디"
        type="text"
        name="userId"
        value={userId}
        onChange={handleChangeUserId}
        error={userIdError}
      />
      <Input
        label="비밀번호"
        type="password"
        name="password"
        value={password}
        onChange={handleChangePassword}
        error={passwordError}
      />

      <Button
        type="submit"
        disabled={!userId || !password || !!userIdError || !!passwordError}
        style={{ marginTop: "10px", width: "100%", height: "40px" }}
      >
        {"로그인"}
      </Button>
    </form>
  );
}
