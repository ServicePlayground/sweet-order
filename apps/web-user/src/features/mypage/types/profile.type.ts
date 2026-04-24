export interface MypageProfile {
  id: string;
  phone: string;
  name: string;
  nickname: string;
  profileImageUrl: string;
  isPhoneVerified: boolean;
  isActive: boolean;
  googleId: string;
  googleEmail: string;
  kakaoId: string;
  kakaoEmail: string;
  createdAt: string;
  lastLoginAt: string;
}
