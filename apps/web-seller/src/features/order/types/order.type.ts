import { PaginationMeta } from "@/apps/web-seller/common/types/api.type";

/**
 * 주문 상태 enum
 */
export enum OrderStatus {
  PENDING = "PENDING", // 대기중 (예약신청)
  CONFIRMED = "CONFIRMED", // 확정됨 (예약확정)
}

/**
 * 주문 정렬 타입
 */
export enum OrderSortBy {
  LATEST = "LATEST", // 최신순
  OLDEST = "OLDEST", // 오래된순
  PRICE_DESC = "PRICE_DESC", // 금액 높은순
  PRICE_ASC = "PRICE_ASC", // 금액 낮은순
}

/**
 * 주문 항목 응답
 */
export interface OrderItemResponse {
  id: string;
  pickupDate: Date;
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
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItemResponse[];
}

/**
 * 주문 목록 조회 파라미터
 */
export interface IGetOrdersListParams {
  page: number;
  limit: number;
  sortBy: OrderSortBy;
  storeId?: string;
  orderStatus?: OrderStatus;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  orderNumber?: string;
}

/**
 * 주문 목록 응답
 */
export interface OrderListResponse {
  data: OrderResponse[];
  meta: PaginationMeta;
}

/**
 * 주문 상태 변경 요청
 */
export interface IUpdateOrderStatusRequest {
  orderStatus: OrderStatus;
}

/**
 * 주문 상태 변경 응답
 */
export interface IUpdateOrderStatusResponse {
  id: string;
}
