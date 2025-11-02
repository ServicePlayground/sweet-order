import { apiClient } from "@/apps/web-seller/common/config/axios.config";
import {
  ICreateStoreRequest,
  ICreateStoreResponse,
  IStoreListItem,
} from "@/apps/web-seller/features/store/types/store.type";

export const storeApi = {
  // 스토어 목록 조회
  getStoreList: async (): Promise<IStoreListItem[]> => {
    const response = await apiClient.get("/store/list");
    return response.data.data;
  },

  // 스토어 생성
  createStore: async (request: ICreateStoreRequest): Promise<ICreateStoreResponse> => {
    const response = await apiClient.post("/store/create", request);
    return response.data.data;
  },
};
