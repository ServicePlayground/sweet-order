import {
  LoginFormData,
  RegisterFormData,
  PhoneVerificationData,
  UserInfo,
} from "@/apps/web-user/features/auth/types/auth.type";
import { apiClient } from "@/apps/web-user/common/config/axios.config";
import { AvailableResponse, MessageResponse } from "@/apps/web-user/common/types/api.type";
import { AxiosInstance } from "axios";

// 인증 관련 API 함수들
export const authApi = {
  // 로그인
  login: async (credentials: LoginFormData): Promise<{ user: UserInfo }> => {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      return response.data.data;
    } catch (error) {
      console.error("로그인 실패:", error);
      throw error;
    }
  },

  // 회원가입
  register: async (credentials: RegisterFormData): Promise<{ user: UserInfo }> => {
    try {
      const response = await apiClient.post("/auth/register", credentials);
      return response.data.data;
    } catch (error) {
      console.error("회원가입 실패:", error);
      throw error;
    }
  },

  // 현재 사용자 정보 조회 (새로고침 시 사용)
  me: async (): Promise<{ user: UserInfo }> => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data.data;
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      throw error;
    }
  },

  // 토큰 재발급 (인터셉터에서 사용하지 않음 - 순환 참조 방지)
  refresh: async (client: AxiosInstance): Promise<MessageResponse> => {
    try {
      const response = await client.post("/auth/refresh");
      return response.data.data;
    } catch (error) {
      console.error("토큰 재발급 실패:", error);
      throw error;
    }
  },

  // 로그아웃
  logout: async (client: AxiosInstance): Promise<MessageResponse> => {
    try {
      const response = await client.post("/auth/logout");
      return response.data.data;
    } catch (error) {
      console.error("로그아웃 실패:", error);
      throw error;
    }
  },

  // ID 중복 검사
  checkUserIdDuplicate: async (userId: string): Promise<AvailableResponse> => {
    try {
      const response = await apiClient.get("/auth/check-user-id", {
        params: { userId },
      });
      return response.data.data;
    } catch (error) {
      console.error("ID 중복 검사 실패:", error);
      throw error;
    }
  },

  // 휴대폰 인증번호 발송
  sendPhoneVerification: async (phone: string): Promise<MessageResponse> => {
    try {
      const response = await apiClient.post("/auth/send-verification-code", { phone });
      return response.data.data;
    } catch (error) {
      console.error("인증번호 발송 실패:", error);
      throw error;
    }
  },

  // 휴대폰 인증번호 검증
  verifyPhoneCode: async (data: PhoneVerificationData): Promise<MessageResponse> => {
    try {
      const response = await apiClient.post("/auth/verify-phone-code", data);
      return response.data.data;
    } catch (error) {
      console.error("인증번호 검증 실패:", error);
      throw error;
    }
  },
};
