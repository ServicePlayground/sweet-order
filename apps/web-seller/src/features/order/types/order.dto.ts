/**
 * 주문 API 타입 (백엔드 order DTO와 1:1 정합)
 * - 단일: OrderResponseDto, OrderItemResponseDto
 * - 목록: OrderListRequestDto, OrderListResponseDto
 * - 변경: UpdateOrderStatusRequestDto, UpdateOrderStatusResponseDto
 */

import type { ListResponseDto } from "@/apps/web-seller/common/types/api.dto";

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
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
  pickupDate: Date;
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
}

/** 주문 목록 조회 응답 */
export type OrderListResponseDto = ListResponseDto<OrderResponseDto>;

export interface UpdateOrderStatusRequestDto {
  orderStatus: OrderStatus;
}

export interface UpdateOrderStatusResponseDto {
  id: string;
}
