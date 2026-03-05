export interface UserProfile {
  id: string;
  role: string;
  phone: string;
  name: string;
  nickname: string;
  email: string;
  profileImageUrl: string | null;
  isPhoneVerified: boolean;
  isActive: boolean;
  userId: string;
  googleId: string;
  googleEmail: string;
  kakaoId?: string;
  naverId?: string;
  createdAt: string;
  lastLoginAt: string;
}
