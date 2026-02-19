import { sellerClient } from "@/apps/web-seller/common/config/axios.config";
import {
  IGetOrdersListParams,
  OrderListResponse,
  OrderResponse,
  IUpdateOrderStatusRequest,
  IUpdateOrderStatusResponse,
} from "@/apps/web-seller/features/order/types/order.type";

export const orderApi = {
  // 판매자용 주문 목록 조회
  getOrders: async (params: IGetOrdersListParams): Promise<OrderListResponse> => {
    const response = await sellerClient.get("/orders", { params });
    return response.data.data;
  },
  // 판매자용 주문 상세 조회
  getOrderDetail: async (orderId: string): Promise<OrderResponse> => {
    const response = await sellerClient.get(`/orders/${orderId}`);
    return response.data.data;
  },
  // 주문 상태 변경
  updateOrderStatus: async (
    orderId: string,
    request: IUpdateOrderStatusRequest,
  ): Promise<IUpdateOrderStatusResponse> => {
    const response = await sellerClient.patch(`/orders/${orderId}/status`, request);
    return response.data.data;
  },
};
