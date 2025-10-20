"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/apps/web-user/common/components/inputs/Input";
import { Button } from "@/apps/web-user/common/components/buttons/Button";
import { useLogin } from "@/apps/web-user/features/auth/hooks/queries/useAuth";
import { AUTH_ERROR_MESSAGES } from "@/apps/web-user/features/auth/constants/auth.constant";
import { PATTERNS } from "@/apps/web-user/common/utils/validator.util";
import { LoginFormData } from "@/apps/web-user/features/auth/types/auth.type";

export default function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    register, // 입력 필드를 폼에 등록하는 함수
    handleSubmit, // 폼 제출을 처리하는 함수
    formState: { errors }, // 폼 검증 에러 상태
    setError, // 프로그래밍적으로 에러를 설정하는 함수
  } = useForm<LoginFormData>();

  // 폼 제출 시 실행되는 함수
  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      // 로그인 성공 시 홈페이지로 리다이렉트
      router.push("/");
    } catch (error) {
      // 로그인 실패 시 에러 메시지 표시
      setError("root", {
        type: "manual",
        message: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="아이디"
        type="text"
        {...register("userId", {
          required: AUTH_ERROR_MESSAGES.USER_ID_REQUIRED,
          pattern: {
            value: PATTERNS.USER_ID_PATTERN,
            message: AUTH_ERROR_MESSAGES.USER_ID_INVALID_FORMAT,
          },
        })}
        error={errors.userId?.message}
      />
      <Input
        label="비밀번호"
        type="password"
        {...register("password", {
          required: AUTH_ERROR_MESSAGES.PASSWORD_REQUIRED,
          minLength: {
            value: 8,
            message: AUTH_ERROR_MESSAGES.PASSWORD_MIN_LENGTH,
          },
          pattern: {
            value: PATTERNS.PASSWORD_PATTERN,
            message: AUTH_ERROR_MESSAGES.PASSWORD_INVALID_FORMAT,
          },
        })}
        error={errors.password?.message}
      />
      <Button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "로그인 중..." : "로그인"}
      </Button>

      {/* 에러 메시지 표시 */}
      {errors.root && <div>{errors.root.message}</div>}
    </form>
  );
}
