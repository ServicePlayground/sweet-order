export const AUDIENCE = {
  CONSUMER: "consumer",
  SELLER: "seller",
} as const;
export type AudienceConst = (typeof AUDIENCE)[keyof typeof AUDIENCE];

export const PHONE_VERIFICATION_PURPOSE = {
  REGISTRATION: "registration",
  GOOGLE_REGISTRATION: "google_registration",
  PHONE_CHANGE: "phone_change",
  FIND_ACCOUNT: "find_account",
} as const;
export type PhoneVerificationPurpose =
  (typeof PHONE_VERIFICATION_PURPOSE)[keyof typeof PHONE_VERIFICATION_PURPOSE];

export interface TokenResponseDto {
  accessToken: string;
  refreshToken?: string;
}

export interface GoogleLoginRequestDto {
  code: string;
}

export interface GoogleRegisterRequestDto {
  googleId: string;
  googleEmail: string;
  name: string;
  phone: string;
}

export interface VerifyPhoneCodeRequestDto {
  phone: string;
  verificationCode: string;
  audience: AudienceConst;
  purpose: PhoneVerificationPurpose;
}

export interface MessageResponseDto {
  message: string;
  /** 인증번호 입력 만료 시각 (ISO 8601) — `POST .../send-verification-code` 응답에 포함 */
  expiresAt?: string;
}
