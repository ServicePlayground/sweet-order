import { userClient } from "@/apps/web-user/common/config/axios.config";
import { StoreInfo, StoreListResponse } from "@/apps/web-user/features/store/types/store.type";

export const storeApi = {
  // 스토어 목록 조회
  getList: async (params: { search?: string; page: number; limit: number }): Promise<StoreListResponse> => {
    const response = await userClient.get("/store", { params });
    return response.data.data;
  },
  // 스토어 상세 조회
  getDetail: async (storeId: string): Promise<StoreInfo> => {
    const response = await userClient.get(`/store/${storeId}`);
    return response.data.data;
  },
};
