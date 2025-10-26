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
