import { apiClient } from "@/apps/web-seller/common/config/axios.config";
import {
  ICreateStoreRequest,
  ICreateStoreResponse,
} from "@/apps/web-seller/features/store/types/store.type";

export const storeApi = {
  // 스토어 생성
  createStore: async (request: ICreateStoreRequest): Promise<ICreateStoreResponse> => {
    const response = await apiClient.post("/store/create", request);
    return response.data.data;
  },
};

