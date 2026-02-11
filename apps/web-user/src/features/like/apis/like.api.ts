import { userClient } from "@/apps/web-user/common/config/axios.config";
import { MessageResponse } from "@/apps/web-user/common/types/api.type";

export const likeApi = {
  // 상품 좋아요 추가
  addProductLike: async (productId: string): Promise<MessageResponse> => {
    const response = await userClient.post(`/products/${productId}/like`);
    return response.data.data;
  },
  // 상품 좋아요 삭제
  removeProductLike: async (productId: string): Promise<MessageResponse> => {
    const response = await userClient.delete(`/products/${productId}/like`);
    return response.data.data;
  },
  // 스토어 좋아요 추가
  addStoreLike: async (storeId: string): Promise<MessageResponse> => {
    const response = await userClient.post(`/store/${storeId}/like`);
    return response.data.data;
  },
  // 스토어 좋아요 삭제
  removeStoreLike: async (storeId: string): Promise<MessageResponse> => {
    const response = await userClient.delete(`/store/${storeId}/like`);
    return response.data.data;
  },
};
