import { apiClient } from "@/apps/web-user/common/config/axios.config";
import { StoreInfo } from "@/apps/web-user/features/store/types/store.type";

export const storeApi = {
  // 스토어 상세 조회
  getDetail: async (storeId: string): Promise<StoreInfo> => {
    const response = await apiClient.get(`/store/${storeId}`);
    return response.data.data;
  },
};
