/**
 * 페이지네이션 메타 정보
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 마이페이지 주문 목록 응답
 */
export interface MyOrdersResponse {
  data: OrderResponse[];
  meta: PaginationMeta;
}

/**
 * 주문 항목 생성 요청
 */
export interface CreateOrderItemRequest {
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
 * 주문 생성 요청 (주문 시점의 정보 전달)
 */
export interface CreateOrderRequest {
  pickupDate: string; // ISO 8601 형식
  productId: string;
  productName: string;
  productImages: string[];
  items: CreateOrderItemRequest[];
  totalQuantity: number;
  totalPrice: number;
  storeName: string;
  // 픽업장소
  pickupAddress: string;
  pickupRoadAddress: string;
  pickupDetailAddress?: string;
  pickupZonecode: string;
  pickupLatitude: number;
  pickupLongitude: number;
}

/**
 * 주문 상태 enum
 */
export enum OrderStatus {
  RESERVATION_REQUESTED = "RESERVATION_REQUESTED", // 예약신청
  PAYMENT_PENDING = "PAYMENT_PENDING", // 입금대기
  PAYMENT_COMPLETED = "PAYMENT_COMPLETED", // 입금완료
  CONFIRMED = "CONFIRMED", // 예약확정
  PICKUP_PENDING = "PICKUP_PENDING", // 픽업대기
  PICKUP_COMPLETED = "PICKUP_COMPLETED", // 픽업완료
  CANCEL_COMPLETED = "CANCEL_COMPLETED", // 취소완료
  CANCEL_REFUND_PENDING = "CANCEL_REFUND_PENDING", // 취소/환불 대기
  CANCEL_REFUND_COMPLETED = "CANCEL_REFUND_COMPLETED", // 취소/환불 완료
  NO_SHOW = "NO_SHOW", // 노쇼
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
  productName: string;
  productImages: string[];
  storeId: string;
  storeName: string;
  orderNumber: string;
  totalQuantity: number;
  totalPrice: number;
  // 픽업장소
  pickupAddress: string;
  pickupRoadAddress: string;
  pickupDate: string; // ISO 8601 형식
  pickupDetailAddress?: string;
  pickupZonecode: string;
  pickupLatitude: number;
  pickupLongitude: number;
  paymentPendingAt?: string;
  orderStatus: OrderStatus;
  // 스토어 정산 계좌 (입금대기 시 표시)
  storeBankName?: string | null;
  storeBankAccountNumber?: string | null;
  storeAccountHolderName?: string | null;
  createdAt: string; // JSON 직렬화 시 ISO 8601 문자열로 변환됨
  updatedAt: string; // JSON 직렬화 시 ISO 8601 문자열로 변환됨
  orderItems: OrderItemResponse[];
}
