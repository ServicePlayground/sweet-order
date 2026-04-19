import type { AudienceConst } from "@apps/backend/modules/auth/constants/auth.constants";

/**
 * 인증 관련 타입 정의
 */

/**
 * JWT 페이로드 (액세스·리프레시 공통 최소 필드)
 */
export interface JwtPayload {
  sub: string;
  /** JWT `aud` 클레임 — `AUDIENCE` 상수 값과 동일한 리터럴 유니온(`AudienceConst`) */
  aud: AudienceConst;
}

/**
 * JWT 토큰 검증 결과 인터페이스
 */
export interface JwtVerifiedPayload extends JwtPayload {
  type?: string;
  iat?: number;
  exp?: number;
}

/**
 * Passport JWT 검증 후 요청에 실리는 사용자 정보
 */
export interface AuthenticatedUser extends JwtVerifiedPayload {
  id: string;
  aud: AudienceConst;
  phone: string;
  loginType: "google";
  loginId: string;
  /** aud === "seller" 일 때만 */
  sellerVerificationStatus?: "REGISTERED" | "BUSINESS_VERIFIED";
}

/**
 * 구글 OAuth 사용자 정보
 */
export interface GoogleUserInfo {
  userInfo: {
    googleId: string;
    googleEmail: string;
  };
}

/**
 * 토큰 쌍
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/** 구매자(Consumer) 프로필 (예: GET /consumer/mypage/profile) */
export interface ConsumerInfo {
  id: string;
  phone: string;
  name: string;
  nickname: string;
  profileImageUrl: string;
  isPhoneVerified: boolean;
  isActive: boolean;
  googleId: string;
  googleEmail: string;
  createdAt: Date;
  lastLoginAt: Date;
}

/** 판매자(Seller) 프로필 DTO (필요 시 별도 프로필 API에서 사용) */
export interface SellerInfo {
  id: string;
  phone: string;
  name: string;
  nickname: string;
  profileImageUrl: string;
  isPhoneVerified: boolean;
  isActive: boolean;
  googleId: string;
  googleEmail: string;
  sellerVerificationStatus: "REGISTERED" | "BUSINESS_VERIFIED";
  createdAt: Date;
  lastLoginAt: Date;
}
