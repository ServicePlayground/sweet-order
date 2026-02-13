/**
 * 주문 항목 생성 요청
 */
export interface CreateOrderItemRequest {
  pickupDate: string; // ISO 8601 형식
  sizeId?: string;
  sizeDisplayName?: string;
  sizeLengthCm?: number;
  sizeDescription?: string;
  sizePrice?: number;
  flavorId?: string;
  flavorDisplayName?: string;
  flavorPrice?: number;
  letteringMessage?: string;
  requestMessage?: string;
  quantity: number;
  imageUrls?: string[];
}

/**
 * 주문 생성 요청
 */
export interface CreateOrderRequest {
  productId: string;
  items: CreateOrderItemRequest[];
  totalQuantity: number;
  totalPrice: number;
  pickupAddress?: string;
  pickupRoadAddress?: string;
  pickupZonecode?: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
}

/**
 * 주문 상태 enum
 */
export enum OrderStatus {
  PENDING = "PENDING", // 대기중 (예약신청)
  CONFIRMED = "CONFIRMED", // 확정됨 (예약확정)
}

/**
 * 주문 응답
 * 백엔드 OrderItemResponseDto와 일치
 */
export interface OrderItemResponse {
  id: string;
  pickupDate: string; // JSON 직렬화 시 ISO 8601 문자열로 변환됨 (백엔드는 Date 타입)
  sizeId?: string;
  sizeDisplayName?: string;
  sizeLengthCm?: number;
  sizeDescription?: string;
  sizePrice?: number;
  flavorId?: string;
  flavorDisplayName?: string;
  flavorPrice?: number;
  letteringMessage?: string;
  requestMessage?: string;
  quantity: number;
  itemPrice: number;
  imageUrls: string[];
  createdAt: string; // JSON 직렬화 시 ISO 8601 문자열로 변환됨 (백엔드는 Date 타입)
  updatedAt: string; // JSON 직렬화 시 ISO 8601 문자열로 변환됨 (백엔드는 Date 타입)
}

/**
 * 주문 응답
 */
export interface OrderResponse {
  id: string;
  userId: string;
  productId: string;
  storeId: string;
  orderNumber: string;
  totalQuantity: number;
  totalPrice: number;
  pickupAddress?: string;
  pickupRoadAddress?: string;
  pickupZonecode?: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  orderStatus: OrderStatus;
  createdAt: string; // JSON 직렬화 시 ISO 8601 문자열로 변환됨
  updatedAt: string; // JSON 직렬화 시 ISO 8601 문자열로 변환됨
  orderItems: OrderItemResponse[];
}

