import { sellerClient } from "@/apps/web-seller/common/config/axios.config";
import type { MessageResponseDto } from "@/apps/web-seller/common/types/api.dto";
import type {
  ChangePhoneRequestDto,
  SellerMypageProfileResponseDto,
  UpdateSellerMypageProfileRequestDto,
  WithdrawAccountRequestDto,
} from "@/apps/web-seller/features/mypage/types/mypage.dto";

export const mypageApi = {
  getProfile: async (): Promise<SellerMypageProfileResponseDto> => {
    const response = await sellerClient.get("/mypage/profile");
    return response.data.data;
  },

  updateProfile: async (
    body: UpdateSellerMypageProfileRequestDto,
  ): Promise<SellerMypageProfileResponseDto> => {
    const response = await sellerClient.patch("/mypage/profile", body);
    return response.data.data;
  },

  changePhone: async (body: ChangePhoneRequestDto): Promise<MessageResponseDto> => {
    const response = await sellerClient.post("/mypage/change-phone", body);
    return response.data.data;
  },

  withdrawAccount: async (body: WithdrawAccountRequestDto): Promise<MessageResponseDto> => {
    const response = await sellerClient.post("/mypage/withdraw", body);
    return response.data.data;
  },
};
