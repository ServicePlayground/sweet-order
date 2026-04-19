import { consumerClient } from "@/apps/web-user/common/config/axios.config";
import {
  AUDIENCE,
  GoogleLoginRequestDto,
  GoogleRegisterRequestDto,
  MessageResponseDto,
  PhoneVerificationPurpose,
  TokenResponseDto,
  VerifyPhoneCodeRequestDto,
} from "@/apps/web-user/features/auth/types/auth.dto";

export const authApi = {
  googleLogin: async (code: string): Promise<TokenResponseDto> => {
    const requestDto: GoogleLoginRequestDto = { code };
    const response = await consumerClient.post("/auth/google/login", requestDto);
    return response.data.data;
  },

  googleRegister: async (data: GoogleRegisterRequestDto): Promise<TokenResponseDto> => {
    const response = await consumerClient.post("/auth/google/register", data);
    return response.data.data;
  },

  sendPhoneVerification: async (
    phone: string,
    purpose: PhoneVerificationPurpose,
  ): Promise<MessageResponseDto & { expiresAt: string }> => {
    const response = await consumerClient.post("/auth/send-verification-code", {
      phone,
      audience: AUDIENCE.CONSUMER,
      purpose,
    });
    return response.data.data;
  },

  verifyPhoneCode: async (
    data: Omit<VerifyPhoneCodeRequestDto, "audience">,
  ): Promise<MessageResponseDto> => {
    const response = await consumerClient.post("/auth/verify-phone-code", {
      ...data,
      audience: AUDIENCE.CONSUMER,
    });
    return response.data.data;
  },
};
