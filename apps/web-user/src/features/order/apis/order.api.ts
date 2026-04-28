import { consumerClient } from "@/apps/web-user/common/config/axios.config";
import {
  CreateOrderItemRequest,
  CreateOrderRequest,
  MyOrdersResponse,
  OrderResponse,
} from "@/apps/web-user/features/order/types/order.type";

export const orderApi = {
  // 주문 생성 (id만 반환)
  createOrder: async (data: CreateOrderRequest): Promise<Pick<OrderResponse, "id">> => {
    const response = await consumerClient.post("/orders", data);
    return response.data.data;
  },
  // 주문 상세조회
  getOrderById: async (orderId: string): Promise<OrderResponse> => {
    const response = await consumerClient.get(`/orders/${orderId}`);
    return response.data.data;
  },
  // 마이페이지 주문 목록 조회
  getMyOrders: async (params?: {
    type?: "UPCOMING" | "PAST";
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<MyOrdersResponse> => {
    const response = await consumerClient.get("/mypage/orders", {
      params: { sortBy: "LATEST", page: 1, limit: 10, ...params },
    });
    return response.data.data;
  },
  // 입금완료 처리
  paymentComplete: async (orderId: string, depositorName: string): Promise<void> => {
    await consumerClient.patch(`/orders/${orderId}/payment-complete`, { depositorName });
  },
  // 입금 전 예약 취소 (RESERVATION_REQUESTED, PAYMENT_PENDING 상태)
  cancelBeforePayment: async (orderId: string, reason: string): Promise<void> => {
    await consumerClient.patch(`/orders/${orderId}/cancel-before-payment`, { reason });
  },
  // 픽업 날짜 변경 (RESERVATION_REQUESTED 상태에서만)
  updateReservationPickupDate: async (orderId: string, pickupDate: string): Promise<void> => {
    await consumerClient.patch(`/orders/${orderId}/reservation/pickup-date`, { pickupDate });
  },
  // 주문 항목 옵션 변경 (RESERVATION_REQUESTED 상태에서만)
  updateReservationOrderItems: async (
    orderId: string,
    body: {
      items: CreateOrderItemRequest[];
      totalQuantity: number;
      totalPrice: number;
    },
  ): Promise<void> => {
    await consumerClient.patch(`/orders/${orderId}/reservation/items`, body);
  },
  // 결제 후 환불 요청 (PAYMENT_COMPLETED, CONFIRMED, PICKUP_PENDING 상태)
  requestRefund: async (
    orderId: string,
    body: {
      reason: string;
      bankName: string;
      bankAccountNumber: string;
      accountHolderName: string;
    },
  ): Promise<void> => {
    await consumerClient.patch(`/orders/${orderId}/refund-request`, body);
  },
};
