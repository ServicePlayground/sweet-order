/**
 * 애플리케이션 경로 상수 관리
 * - 모든 라우팅 경로를 중앙에서 관리
 * - 경로 변경 시 한 곳에서만 수정하면 됨
 */

export const PATHS = {
  // 인증 관련 경로
  AUTH: {
    LOGIN: "/login",
    LOGIN_BASIC: "/login/basic",
    REGISTER_BASIC: "/register/basic",
    FIND_ACCOUNT: "/find-account",
  },

  // 메인 페이지
  HOME: "/",
} as const;

// 타입 안전성을 위한 경로 타입
export type AuthPath = (typeof PATHS.AUTH)[keyof typeof PATHS.AUTH];
