import {
  VerifyPhoneCodeRequestDto,
  GoogleRegisterRequestDto,
  PhoneVerificationPurpose,
  AUDIENCE,
  GoogleLoginRequestDto,
  TokenResponseDto,
  MeResponseDto,
  FindAccountRequestDto,
  FindAccountResponseDto,
  ChangePhoneRequestDto,
} from "@/apps/web-seller/features/auth/types/auth.dto";
import { sellerClient } from "@/apps/web-seller/common/config/axios.config";
import type { MessageResponseDto } from "@/apps/web-seller/common/types/api.dto";

/**
 * 인증 관련 API 함수들
 */
export const authApi = {
  me: async (): Promise<MeResponseDto> => {
    const response = await sellerClient.get("/auth/me");
    return response.data.data;
  },

  sendPhoneVerification: async (
    phone: string,
    purpose: PhoneVerificationPurpose,
  ): Promise<MessageResponseDto & { expiresAt: string }> => {
    const response = await sellerClient.post("/auth/send-verification-code", {
      phone,
      audience: AUDIENCE.SELLER,
      purpose,
    });
    return response.data.data;
  },

  verifyPhoneCode: async (
    data: Omit<VerifyPhoneCodeRequestDto, "audience">,
  ): Promise<MessageResponseDto> => {
    const response = await sellerClient.post("/auth/verify-phone-code", {
      ...data,
      audience: AUDIENCE.SELLER,
    });
    return response.data.data;
  },

  googleLogin: async (code: string): Promise<TokenResponseDto> => {
    const requestDto: GoogleLoginRequestDto = { code };
    const response = await sellerClient.post("/auth/google/login", requestDto);
    return response.data.data;
  },

  googleRegister: async (data: GoogleRegisterRequestDto): Promise<TokenResponseDto> => {
    const response = await sellerClient.post("/auth/google/register", data);
    return response.data.data;
  },

  findAccount: async (body: FindAccountRequestDto): Promise<FindAccountResponseDto> => {
    const response = await sellerClient.post("/auth/find-account", body);
    return response.data.data;
  },

  changePhone: async (body: ChangePhoneRequestDto): Promise<MessageResponseDto> => {
    const response = await sellerClient.post("/auth/change-phone", body);
    return response.data.data;
  },
};
