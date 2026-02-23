import {
  LoginRequestDto,
  RegisterRequestDto,
  VerifyPhoneCodeRequestDto,
  GoogleRegisterRequestDto,
  FindAccountResponseDto,
  ResetPasswordRequestDto,
  PhoneVerificationPurpose,
  GoogleLoginRequestDto,
  TokenResponseDto,
  MeResponseDto,
} from "@/apps/web-seller/features/auth/types/auth.dto";
import { userClient } from "@/apps/web-seller/common/config/axios.config";
import type {
  AvailableResponseDto,
  MessageResponseDto,
} from "@/apps/web-seller/common/types/api.dto";

// 인증 관련 API 함수들
export const authApi = {
  // 로그인
  login: async (credentials: LoginRequestDto): Promise<TokenResponseDto> => {
    const response = await userClient.post("/auth/login", credentials);
    return response.data.data;
  },

  // 회원가입
  register: async (credentials: RegisterRequestDto): Promise<TokenResponseDto> => {
    const response = await userClient.post("/auth/register", credentials);
    return response.data.data;
  },

  // 현재 사용자 정보 조회 (새로고침 시 사용)
  me: async (): Promise<MeResponseDto> => {
    const response = await userClient.get("/auth/me");
    return response.data.data;
  },

  // ID 중복 검사
  checkUserIdDuplicate: async (userId: string): Promise<AvailableResponseDto> => {
    const response = await userClient.get("/auth/check-user-id", {
      params: { userId },
    });
    return response.data.data;
  },

  // 휴대폰 인증번호 발송
  sendPhoneVerification: async (
    phone: string,
    purpose: PhoneVerificationPurpose,
  ): Promise<MessageResponseDto> => {
    const response = await userClient.post("/auth/send-verification-code", { phone, purpose });
    return response.data.data;
  },

  // 휴대폰 인증번호 검증
  verifyPhoneCode: async (data: VerifyPhoneCodeRequestDto): Promise<MessageResponseDto> => {
    const response = await userClient.post("/auth/verify-phone-code", data);
    return response.data.data;
  },

  // 구글 로그인
  googleLogin: async (code: string): Promise<TokenResponseDto> => {
    const requestDto: GoogleLoginRequestDto = { code };
    const response = await userClient.post("/auth/google/login", requestDto);
    return response.data.data;
  },

  // 구글 회원가입
  googleRegister: async (data: GoogleRegisterRequestDto): Promise<TokenResponseDto> => {
    const response = await userClient.post("/auth/google/register", data);
    return response.data.data;
  },

  // 계정 찾기
  findAccount: async (phone: string): Promise<FindAccountResponseDto> => {
    const response = await userClient.get("/auth/find-account", {
      params: { phone },
    });
    return response.data.data;
  },

  // 비밀번호 재설정
  resetPassword: async (data: ResetPasswordRequestDto): Promise<MessageResponseDto> => {
    const response = await userClient.post("/auth/change-password", data);
    return response.data.data;
  },
};
