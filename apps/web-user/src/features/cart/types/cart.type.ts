import {
  OrderFormData,
  OrderFormSchema,
  DeliveryMethod,
} from "@/apps/web-user/features/product/types/product.type";

/**
 * 장바구니에 상품 추가 요청
 */
export interface AddCartItemRequest {
  productId: string;
  quantity: number;
  orderFormData?: OrderFormData;
  deliveryMethod: DeliveryMethod;
}

/**
 * 장바구니 항목의 상품 정보 (백엔드 응답 구조에 맞춤)
 */
export interface CartItemProduct {
  id: string;
  storeId: string;
  name: string;
  description: string | null;
  originalPrice: number;
  salePrice: number;
  stock: number;
  notice: string | null;
  caution: string | null;
  basicIncluded: string | null;
  location: string | null;
  images: string[];
  status: string;
  orderFormSchema: OrderFormSchema | null;
  deliveryMethod: DeliveryMethod[];
}

/**
 * 장바구니 항목
 */
export interface CartItem {
  id: string;
  quantity: number;
  orderFormData: OrderFormData | null;
  deliveryMethod: DeliveryMethod;
  createdAt: string;
  updatedAt: string;
  product: CartItemProduct;
}

/**
 * 장바구니 목록 응답
 */
export interface CartListResponse {
  data: CartItem[];
}

/**
 * 장바구니 항목 수정 요청
 */
export interface UpdateCartItemRequest {
  quantity: number;
}
