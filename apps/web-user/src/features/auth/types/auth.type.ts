export type UserRole = "USER" | "SELLER" | "ADMIN"; // 사용자 역할

/**
 * 휴대폰 인증 목적
 */
export const PHONE_VERIFICATION_PURPOSE = {
  REGISTRATION: "registration",
  GOOGLE_REGISTRATION: "google_registration",
  PASSWORD_RECOVERY: "password_recovery",
  ID_FIND: "id_find",
  PHONE_CHANGE: "phone_change",
} as const;

/**
 * 휴대폰 인증 목적 타입
 */
export type PhoneVerificationPurpose =
  (typeof PHONE_VERIFICATION_PURPOSE)[keyof typeof PHONE_VERIFICATION_PURPOSE];

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

export interface LoginFormData {
  userId: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  phone: string;
}

export interface PhoneVerificationData {
  phone: string;
  verificationCode: string;
  purpose: PhoneVerificationPurpose;
}

export interface GoogleLoginFormData {
  googleId: string;
  googleEmail: string;
}

export interface GoogleRegisterFormData extends GoogleLoginFormData {
  phone: string;
}

export interface FindAccountFormData {
  userId?: string;
  googleEmail?: string;
}

export interface ResetPasswordFormData {
  phone: string;
  userId: string;
  newPassword: string;
}
