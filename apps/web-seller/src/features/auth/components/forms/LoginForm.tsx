import { useState } from "react";
import { Input } from "@/apps/web-seller/common/components/inputs/Input";
import { Button } from "@/apps/web-seller/common/components/buttons/Button";
import { useLogin } from "@/apps/web-seller/features/auth/hooks/queries/useAuth";
import { AUTH_ERROR_MESSAGES } from "@/apps/web-seller/features/auth/constants/auth.constant";
import { isValidPassword, isValidUserId } from "@/apps/web-seller/common/utils/validator.util";

export default function LoginForm() {
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

  // 제출
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await loginMutation.mutateAsync({ userId, password });
  };

  return (
    <form onSubmit={onSubmit} style={{ width: "100%" }}>
      <div style={{ marginBottom: "20px" }}>
        <Input
          label="아이디"
          type="text"
          name="userId"
          value={userId}
          onChange={handleChangeUserId}
          error={userIdError}
          placeholder="아이디를 입력하세요"
        />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <Input
          label="비밀번호"
          type="password"
          name="password"
          value={password}
          onChange={handleChangePassword}
          error={passwordError}
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      <Button
        type="submit"
        disabled={
          !userId || !password || !!userIdError || !!passwordError || loginMutation.isPending
        }
        style={{
          width: "100%",
          height: "48px",
          borderRadius: "6px",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        {loginMutation.isPending ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
