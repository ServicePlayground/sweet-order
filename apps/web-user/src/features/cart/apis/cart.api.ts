import { apiClient } from "@/apps/web-user/common/config/axios.config";
import { MessageResponse } from "@/apps/web-user/common/types/api.type";
import { AddCartItemRequest } from "@/apps/web-user/features/cart/types/cart.type";

export const cartApi = {
  // 장바구니에 상품 추가
  addCartItem: async (data: AddCartItemRequest): Promise<MessageResponse> => {
    const response = await apiClient.post("/cart", data);
    return response.data.data;
  },
};
