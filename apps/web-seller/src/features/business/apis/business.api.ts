import { apiClient } from "@/apps/web-seller/common/config/axios.config";
import { AvailableResponse } from "@/apps/web-seller/common/types/api.type";
import {
  IBusinessRegistrationForm,
  IOnlineTradingCompanyDetailRequest,
} from "@/apps/web-seller/features/business/types/business.type";

export const businessApi = {
  // 사업자등록번호 진위확인
  verifyBusinessRegistration: async (
    form: IBusinessRegistrationForm,
  ): Promise<AvailableResponse> => {
    const response = await apiClient.post("/business/validate", form);
    return response.data.data;
  },

  // 통신판매사업자 등록상세 조회
  getOnlineTradingCompanyDetail: async (
    request: IOnlineTradingCompanyDetailRequest,
  ): Promise<AvailableResponse> => {
    const response = await apiClient.get("/business/online-trading-company/detail", {
      params: request,
    });
    return response.data.data;
  },
};
