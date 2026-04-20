import { consumerClient } from "@/apps/web-user/common/config/axios.config";
import {
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
  paymentComplete: async (orderId: string): Promise<void> => {
    await consumerClient.patch(`/orders/${orderId}/payment-complete`);
  },
};
