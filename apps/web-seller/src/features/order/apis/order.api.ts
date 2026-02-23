import { sellerClient } from "@/apps/web-seller/common/config/axios.config";
import {
  OrderListRequestDto,
  OrderListResponseDto,
  OrderResponseDto,
  UpdateOrderStatusRequestDto,
  UpdateOrderStatusResponseDto,
} from "@/apps/web-seller/features/order/types/order.dto";

export const orderApi = {
  // 판매자용 주문 목록 조회
  getOrders: async (params: OrderListRequestDto): Promise<OrderListResponseDto> => {
    const response = await sellerClient.get("/orders", { params });
    return response.data.data;
  },
  // 판매자용 주문 상세 조회
  getOrderDetail: async (orderId: string): Promise<OrderResponseDto> => {
    const response = await sellerClient.get(`/orders/${orderId}`);
    return response.data.data;
  },
  // 주문 상태 변경
  updateOrderStatus: async (
    orderId: string,
    request: UpdateOrderStatusRequestDto,
  ): Promise<UpdateOrderStatusResponseDto> => {
    const response = await sellerClient.patch(`/orders/${orderId}/status`, request);
    return response.data.data;
  },
};
