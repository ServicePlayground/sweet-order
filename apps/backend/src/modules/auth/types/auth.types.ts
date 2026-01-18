/**
 * 인증 관련 타입 정의
 * 사용자 인증과 관련된 모든 타입들을 중앙 집중식으로 관리합니다.
 */

export type UserRole = "USER" | "SELLER" | "ADMIN"; // 사용자 역할

/**
 * 사용자 정보 인터페이스
 * User 엔티티의 주요 필드를 포함하는 사용자 정보 구조를 정의합니다.
 */
export interface UserInfo {
  id: string;
  role: UserRole;
  userId?: string;
  phone: string;
  name?: string;
  nickname?: string;
  email?: string;
  profileImageUrl?: string;
  isPhoneVerified: boolean;
  isActive: boolean;
  googleId?: string;
  googleEmail?: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

/**
 * JWT 페이로드 인터페이스
 * JWT 토큰의 페이로드 구조를 정의합니다.
 * 최소한의 정보만 포함하여 토큰 크기를 줄이고, 변경 가능한 정보(role 등)는 DB에서 조회합니다.
 */
export interface JwtPayload {
  sub: string; // 사용자 고유 ID (user.id) - 유일하게 필요한 정보
}

/**
 * JWT 토큰 검증 결과 인터페이스
 * JWT 라이브러리에서 반환하는 전체 페이로드 구조
 */
export interface JwtVerifiedPayload extends JwtPayload {
  type?: string; // 토큰 타입 (access | refresh)
  iat?: number; // 토큰 발급 시간
  exp?: number; // 토큰 만료 시간
}

/**
 * JWT 검증 후 DB에서 조회한 최신 사용자 정보
 * JWT Strategy의 validate 메서드에서 반환하는 최종 사용자 정보
 */
export interface AuthenticatedUser extends JwtVerifiedPayload {
  id: string; // 사용자 고유 ID (user.id)
  role: UserRole;
  phone: string;
  loginType: "general" | "google";
  loginId: string;
}

/**
 * 토큰 쌍 인터페이스
 * 액세스 토큰과 리프레시 토큰을 포함하는 구조를 정의합니다.
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * 구글 OAuth 사용자 정보 인터페이스
 * 구글에서 받은 사용자 정보 구조를 정의합니다.
 */
export interface GoogleUserInfo {
  userInfo: {
    googleId: string;
    googleEmail: string;
  };
}
