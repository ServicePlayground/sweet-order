import { sellerClient } from "@/apps/web-seller/common/config/axios.config";
import {
  ICreateStoreRequest,
  ICreateStoreResponse,
  IStoreListItem,
  IStoreDetail,
  IUpdateStoreRequest,
} from "@/apps/web-seller/features/store/types/store.type";

export const storeApi = {
  // 스토어 목록 조회
  getStoreList: async (): Promise<{ stores: IStoreListItem[] }> => {
    const response = await sellerClient.get("/store/list");
    return response.data.data;
  },

  // 스토어 상세 조회
  getStoreDetail: async (storeId: string): Promise<IStoreDetail> => {
    const response = await sellerClient.get(`/store/${storeId}`);
    return response.data.data;
  },

  // 스토어 생성
  createStore: async (request: ICreateStoreRequest): Promise<ICreateStoreResponse> => {
    const response = await sellerClient.post("/store/create", request);
    return response.data.data;
  },

  // 스토어 수정
  updateStore: async (
    storeId: string,
    request: IUpdateStoreRequest,
  ): Promise<ICreateStoreResponse> => {
    const response = await sellerClient.put(`/store/${storeId}`, request);
    return response.data.data;
  },
};
