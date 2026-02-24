/**
 * 인증 API 타입 (백엔드 auth DTO/응답과 1:1 정합)
 */

export type UserRole = "USER" | "SELLER" | "ADMIN";

export const PHONE_VERIFICATION_PURPOSE = {
  REGISTRATION: "registration",
  GOOGLE_REGISTRATION: "google_registration",
  PASSWORD_RECOVERY: "password_recovery",
  ID_FIND: "id_find",
  PHONE_CHANGE: "phone_change",
} as const;

export type PhoneVerificationPurpose =
  (typeof PHONE_VERIFICATION_PURPOSE)[keyof typeof PHONE_VERIFICATION_PURPOSE];

/** /auth/me 응답 사용자 정보 (백엔드 UserInfo) */
export interface UserInfoDto {
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

/** /auth/me 응답 (accessToken + user) */
export interface MeResponseDto {
  accessToken: string;
  user: UserInfoDto;
}

/** 로그인/회원가입 등 토큰 응답 */
export interface TokenResponseDto {
  accessToken: string;
}

/** 로그인 요청 */
export interface LoginRequestDto {
  userId: string;
  password: string;
}

/** 회원가입 요청 */
export interface RegisterRequestDto extends LoginRequestDto {
  phone: string;
}

/** 휴대폰 인증번호 검증 요청 */
export interface VerifyPhoneCodeRequestDto {
  phone: string;
  verificationCode: string;
  purpose: PhoneVerificationPurpose;
}

/** 구글 로그인 요청 */
export interface GoogleLoginRequestDto {
  code: string;
}

/** 구글 회원가입 요청 */
export interface GoogleRegisterRequestDto {
  googleId: string;
  googleEmail: string;
  phone: string;
}

/** 계정 찾기 응답 (userId 또는 googleEmail) */
export interface FindAccountResponseDto {
  userId?: string;
  googleEmail?: string;
}

/** 비밀번호 재설정 요청 */
export interface ResetPasswordRequestDto {
  phone: string;
  userId: string;
  newPassword: string;
}
