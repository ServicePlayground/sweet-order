import {
  LoginFormData,
  RegisterFormData,
  PhoneVerificationData,
  UserInfo,
  GoogleRegisterFormData,
  FindAccountFormData,
  ResetPasswordFormData,
} from "@/apps/web-user/features/auth/types/auth.type";
import { apiClient } from "@/apps/web-user/common/config/axios.config";
import { AvailableResponse, MessageResponse } from "@/apps/web-user/common/types/api.type";
import { AxiosInstance } from "axios";

// 인증 관련 API 함수들
export const authApi = {
  // 로그인
  login: async (credentials: LoginFormData): Promise<{ user: UserInfo }> => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data.data;
  },

  // 회원가입
  register: async (credentials: RegisterFormData): Promise<{ user: UserInfo }> => {
    const response = await apiClient.post("/auth/register", credentials);
    return response.data.data;
  },

  // 현재 사용자 정보 조회 (새로고침 시 사용)
  me: async (): Promise<{ user: UserInfo }> => {
    const response = await apiClient.get("/auth/me");
    return response.data.data;
  },

  // 토큰 재발급 (인터셉터에서 사용하지 않음 - 순환 참조 방지)
  refresh: async (client: AxiosInstance): Promise<MessageResponse> => {
    const response = await client.post("/auth/refresh");
    return response.data.data;
  },

  // 로그아웃
  logout: async (client: AxiosInstance): Promise<MessageResponse> => {
    const response = await client.post("/auth/logout");
    return response.data.data;
  },

  // ID 중복 검사
  checkUserIdDuplicate: async (userId: string): Promise<AvailableResponse> => {
    const response = await apiClient.get("/auth/check-user-id", {
      params: { userId },
    });
    return response.data.data;
  },

  // 휴대폰 인증번호 발송
  sendPhoneVerification: async (phone: string): Promise<MessageResponse> => {
    const response = await apiClient.post("/auth/send-verification-code", { phone });
    return response.data.data;
  },

  // 휴대폰 인증번호 검증
  verifyPhoneCode: async (data: PhoneVerificationData): Promise<MessageResponse> => {
    const response = await apiClient.post("/auth/verify-phone-code", data);
    return response.data.data;
  },

  // 구글 로그인
  googleLogin: async (code: string): Promise<{ user: UserInfo }> => {
    const response = await apiClient.post("/auth/google/login", { code });
    return response.data.data;
  },

  // 구글 회원가입
  googleRegister: async (data: GoogleRegisterFormData): Promise<{ user: UserInfo }> => {
    const response = await apiClient.post("/auth/google/register", data);
    return response.data.data;
  },

  // 계정 찾기
  findAccount: async (phone: string): Promise<FindAccountFormData> => {
    const response = await apiClient.get("/auth/find-account", {
      params: { phone },
    });
    return response.data.data;
  },

  // 비밀번호 재설정
  resetPassword: async (data: ResetPasswordFormData): Promise<MessageResponse> => {
    const response = await apiClient.post("/auth/change-password", data);
    return response.data.data;
  },
};
