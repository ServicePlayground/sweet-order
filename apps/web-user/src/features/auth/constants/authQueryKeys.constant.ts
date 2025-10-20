/**
 * Auth 관련 쿼리 키 상수
 */
export const authQueryKeys = {
  // 사용자 인증 정보 (POST /v1/user/auth/login)
  me: ["auth", "user"] as const,
} as const;
