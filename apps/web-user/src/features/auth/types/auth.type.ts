export type UserRole = "USER" | "SELLER" | "ADMIN"; // 사용자 역할

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
