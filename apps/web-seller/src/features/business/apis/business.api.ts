import { apiClient } from "@/apps/web-seller/common/config/axios.config";
import {
  IBusinessRegistrationForm,
  IBusinessRegistrationResponse,
} from "@/apps/web-seller/features/business/types/business.type";

export const businessApi = {
  // 사업자등록번호 진위확인
  verifyBusinessRegistration: async (
    form: IBusinessRegistrationForm,
  ): Promise<IBusinessRegistrationResponse> => {
    const response = await apiClient.post("/business/validate", form);
    return response.data.data;
  },
};
