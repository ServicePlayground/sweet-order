/**
 * 인증 관련 타입 정의
 * 사용자 인증과 관련된 모든 타입들을 중앙 집중식으로 관리합니다.
 */

/**
 * 사용자 정보 인터페이스
 * User 엔티티의 주요 필드를 포함하는 사용자 정보 구조를 정의합니다.
 */
export interface UserInfo {
  id: string;
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
 */
export interface JwtPayload {
  sub: string; // 사용자 고유 ID (user.id)
  phone: string; // 휴대폰 번호
  loginType: "general" | "google"; // 로그인 타입
  loginId: string; // 해당 로그인 타입의 ID
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
