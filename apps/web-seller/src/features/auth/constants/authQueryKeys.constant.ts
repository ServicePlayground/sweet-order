/**
 * Auth 관련 쿼리 키 상수
 */
export const authQueryKeys = {
  /** GET /v1/seller/auth/me */
  me: ["auth", "seller"] as const,
} as const;
