import { OrderFormData } from "@/apps/web-user/features/product/types/product.type";

/**
 * 장바구니에 상품 추가 요청
 */
export interface AddCartItemRequest {
  productId: string;
  quantity: number;
  orderFormData?: OrderFormData;
}
