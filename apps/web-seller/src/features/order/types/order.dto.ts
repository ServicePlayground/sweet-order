/**
 * 주문 API 타입 (백엔드 order DTO와 1:1 정합)
 * - 단일: OrderResponseDto, OrderItemResponseDto
 * - 목록: OrderListRequestDto, OrderListResponseDto
 * - 변경: UpdateOrderStatusRequestDto, UpdateOrderStatusResponseDto
 */

import type { ListResponseDto } from "@/apps/web-seller/common/types/api.dto";

export enum OrderStatus {
  RESERVATION_REQUESTED = "RESERVATION_REQUESTED",
  PAYMENT_PENDING = "PAYMENT_PENDING",
  PAYMENT_COMPLETED = "PAYMENT_COMPLETED",
  CONFIRMED = "CONFIRMED",
  PICKUP_PENDING = "PICKUP_PENDING",
  PICKUP_COMPLETED = "PICKUP_COMPLETED",
  CANCEL_COMPLETED = "CANCEL_COMPLETED",
  CANCEL_REFUND_PENDING = "CANCEL_REFUND_PENDING",
  CANCEL_REFUND_COMPLETED = "CANCEL_REFUND_COMPLETED",
  NO_SHOW = "NO_SHOW",
}

export enum OrderSortBy {
  LATEST = "LATEST",
  OLDEST = "OLDEST",
  PRICE_DESC = "PRICE_DESC",
  PRICE_ASC = "PRICE_ASC",
}

export enum OrderType {
  UPCOMING = "UPCOMING",
  PAST = "PAST",
}

export interface OrderItemResponseDto {
  id: string;
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

export interface OrderResponseDto {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productImages: string[];
  storeId: string;
  storeName: string;
  storeBankName?: string | null;
  storeBankAccountNumber?: string | null;
  storeAccountHolderName?: string | null;
  orderNumber: string;
  totalQuantity: number;
  totalPrice: number;
  pickupAddress: string;
  pickupRoadAddress: string;
  pickupDetailAddress?: string;
  pickupZonecode: string;
  pickupLatitude: number;
  pickupLongitude: number;
  orderStatus: OrderStatus;
  /** 입금대기 진입 시각(입금 12시간 기준). 예약신청 단계에서는 null */
  paymentPendingAt?: Date | string | null;
  pickupDate: Date;
  userCancelReason?: string | null;
  sellerCancelReason?: string | null;
  sellerNoShowReason?: string | null;
  refundRequestReason?: string | null;
  sellerCancelRefundPendingReason?: string | null;
  refundBankName?: string | null;
  refundBankAccountNumber?: string | null;
  refundAccountHolderName?: string | null;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItemResponseDto[];
}

/** 주문 목록 조회 요청 (백엔드 OrderListRequestDto) */
export interface OrderListRequestDto {
  page: number;
  limit: number;
  sortBy: OrderSortBy;
  storeId?: string;
  orderStatus?: OrderStatus;
  startDate?: string;
  endDate?: string;
  orderNumber?: string;
  type?: OrderType;
  /** YYYY-MM-DD, Asia/Seoul 달력 (백엔드 pickupStartDate) */
  pickupStartDate?: string;
  /** YYYY-MM-DD, Asia/Seoul 달력 (백엔드 pickupEndDate) */
  pickupEndDate?: string;
}

/** 주문 목록 조회 응답 */
export type OrderListResponseDto = ListResponseDto<OrderResponseDto>;

export interface UpdateOrderStatusRequestDto {
  orderStatus: OrderStatus;
  sellerCancelReason?: string;
  sellerNoShowReason?: string;
  sellerCancelRefundPendingReason?: string;
}

export interface UpdateOrderStatusResponseDto {
  id: string;
}
