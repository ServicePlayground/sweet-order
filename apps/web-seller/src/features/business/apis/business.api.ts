import { sellerClient } from "@/apps/web-seller/common/config/axios.config";
import type { AvailableResponseDto } from "@/apps/web-seller/common/types/api.dto";
import {
  BusinessValidationRequestDto,
  OnlineTradingCompanyDetailRequestDto,
} from "@/apps/web-seller/features/business/types/business.dto";

export const businessApi = {
  // 사업자등록번호 진위확인
  verifyBusinessRegistration: async (
    form: BusinessValidationRequestDto,
  ): Promise<AvailableResponseDto> => {
    const response = await sellerClient.post("/business/validate", form);
    return response.data.data;
  },

  // 통신판매사업자 등록상세 조회
  getOnlineTradingCompanyDetail: async (
    request: OnlineTradingCompanyDetailRequestDto,
  ): Promise<AvailableResponseDto> => {
    const response = await sellerClient.get("/business/online-trading-company/detail", {
      params: request,
    });
    return response.data.data;
  },
};
