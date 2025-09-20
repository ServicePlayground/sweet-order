import { TOKEN_TYPES } from "@web-user/backend/common/constants/app.constants";

/**
 * JWT 페이로드 인터페이스
 *
 * ERD 요구사항에 따른 JWT 토큰의 페이로드 구조를 정의합니다.
 */
export interface JwtPayload {
  /** 사용자 ID (ERD User.id) */
  sub: string;
  /** 사용자 식별자 (ERD User.userId) */
  userId: string;
  /** 휴대폰 번호 (ERD User.phone) */
  phone?: string;
  /** 토큰 발급 시간 */
  iat?: number;
  /** 토큰 만료 시간 */
  exp?: number;
  /** 토큰 타입 (access | refresh) */
  type?: string;
}

/**
 * 토큰 쌍 인터페이스
 *
 * 액세스 토큰과 리프레시 토큰을 포함하는 구조를 정의합니다.
 */
export interface TokenPair {
  /** 액세스 토큰 */
  accessToken: string;
  /** 리프레시 토큰 */
  refreshToken: string;
}

/**
 * JWT 전략에서 반환하는 사용자 정보 타입
 */
export interface JwtUserInfo {
  /** 사용자 ID */
  id: string;
  /** 사용자 식별자 */
  userId: string;
  /** 휴대폰 번호 */
  phone: string;
}

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES];
