import { sellerClient } from "@/apps/web-seller/common/config/axios.config";
import {
  CreateStoreRequestDto,
  CreateStoreResponseDto,
  StoreResponseDto,
  UpdateStoreRequestDto,
  UpdateStoreResponseDto,
  GetSellerStoresRequestDto,
  StoreListResponseDto,
} from "@/apps/web-seller/features/store/types/store.dto";

export const storeApi = {
  // 스토어 목록 조회
  getStoreList: async (params: GetSellerStoresRequestDto): Promise<StoreListResponseDto> => {
    const response = await sellerClient.get("/store/list", { params });
    return response.data.data;
  },

  // 스토어 상세 조회
  getStoreDetail: async (storeId: string): Promise<StoreResponseDto> => {
    const response = await sellerClient.get(`/store/${storeId}`);
    return response.data.data;
  },

  // 스토어 생성
  createStore: async (request: CreateStoreRequestDto): Promise<CreateStoreResponseDto> => {
    const response = await sellerClient.post("/store/create", request);
    return response.data.data;
  },

  // 스토어 수정
  updateStore: async (
    storeId: string,
    request: UpdateStoreRequestDto,
  ): Promise<UpdateStoreResponseDto> => {
    const response = await sellerClient.put(`/store/${storeId}`, request);
    return response.data.data;
  },
};
