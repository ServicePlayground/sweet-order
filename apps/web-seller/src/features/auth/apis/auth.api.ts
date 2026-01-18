import {
  LoginFormData,
  RegisterFormData,
  PhoneVerificationData,
  UserInfo,
  GoogleRegisterFormData,
  FindAccountFormData,
  ResetPasswordFormData,
  PhoneVerificationPurpose,
  TokenResponse,
  MeResponse,
} from "@/apps/web-seller/features/auth/types/auth.type";
import { userClient } from "@/apps/web-seller/common/config/axios.config";
import { AvailableResponse, MessageResponse } from "@/apps/web-seller/common/types/api.type";

// 인증 관련 API 함수들
export const authApi = {
  // 로그인
  login: async (credentials: LoginFormData): Promise<TokenResponse> => {
    const response = await userClient.post("/auth/login", credentials);
    return response.data.data;
  },

  // 회원가입
  register: async (credentials: RegisterFormData): Promise<TokenResponse> => {
    const response = await userClient.post("/auth/register", credentials);
    return response.data.data;
  },

  // 현재 사용자 정보 조회 (새로고침 시 사용)
  me: async (): Promise<MeResponse> => {
    const response = await userClient.get("/auth/me");
    return response.data.data;
  },

  // ID 중복 검사
  checkUserIdDuplicate: async (userId: string): Promise<AvailableResponse> => {
    const response = await userClient.get("/auth/check-user-id", {
      params: { userId },
    });
    return response.data.data;
  },

  // 휴대폰 인증번호 발송
  sendPhoneVerification: async (
    phone: string,
    purpose: PhoneVerificationPurpose,
  ): Promise<MessageResponse> => {
    const response = await userClient.post("/auth/send-verification-code", { phone, purpose });
    return response.data.data;
  },

  // 휴대폰 인증번호 검증
  verifyPhoneCode: async (data: PhoneVerificationData): Promise<MessageResponse> => {
    const response = await userClient.post("/auth/verify-phone-code", data);
    return response.data.data;
  },

  // 구글 로그인
  googleLogin: async (code: string): Promise<TokenResponse> => {
    const response = await userClient.post("/auth/google/login", { code });
    return response.data.data;
  },

  // 구글 회원가입
  googleRegister: async (data: GoogleRegisterFormData): Promise<TokenResponse> => {
    const response = await userClient.post("/auth/google/register", data);
    return response.data.data;
  },

  // 계정 찾기
  findAccount: async (phone: string): Promise<FindAccountFormData> => {
    const response = await userClient.get("/auth/find-account", {
      params: { phone },
    });
    return response.data.data;
  },

  // 비밀번호 재설정
  resetPassword: async (data: ResetPasswordFormData): Promise<MessageResponse> => {
    const response = await userClient.post("/auth/change-password", data);
    return response.data.data;
  },
};
