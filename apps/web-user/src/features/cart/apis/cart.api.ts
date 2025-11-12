import { apiClient } from "@/apps/web-user/common/config/axios.config";
import { MessageResponse } from "@/apps/web-user/common/types/api.type";
import {
  AddCartItemRequest,
  CartListResponse,
  UpdateCartItemRequest,
} from "@/apps/web-user/features/cart/types/cart.type";

export const cartApi = {
  // 장바구니 목록 조회
  getCartItems: async (): Promise<CartListResponse> => {
    const response = await apiClient.get("/cart");
    return response.data.data;
  },
  // 장바구니에 상품 추가
  addCartItem: async (data: AddCartItemRequest): Promise<MessageResponse> => {
    const response = await apiClient.post("/cart", data);
    return response.data.data;
  },
  // 장바구니 항목 수정
  updateCartItem: async (
    cartItemId: string,
    data: UpdateCartItemRequest,
  ): Promise<MessageResponse> => {
    const response = await apiClient.put(`/cart/${cartItemId}`, data);
    return response.data.data;
  },
  // 장바구니 항목 삭제
  removeCartItem: async (cartItemId: string): Promise<MessageResponse> => {
    const response = await apiClient.delete(`/cart/${cartItemId}`);
    return response.data.data;
  },
  // 장바구니 전체 삭제
  clearCart: async (): Promise<MessageResponse> => {
    const response = await apiClient.delete("/cart");
    return response.data.data;
  },
};
