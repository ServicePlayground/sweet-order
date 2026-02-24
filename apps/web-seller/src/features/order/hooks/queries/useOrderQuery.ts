import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { orderApi } from "@/apps/web-seller/features/order/apis/order.api";
import { orderQueryKeys } from "@/apps/web-seller/features/order/constants/orderQueryKeys.constant";
import {
  OrderListResponseDto,
  OrderSortBy,
  OrderResponseDto,
  OrderListRequestDto,
} from "@/apps/web-seller/features/order/types/order.dto";
import type { OrderListQueryParams } from "@/apps/web-seller/features/order/types/order.ui";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";

export function useOrderList({
  page = 1,
  limit = 30,
  sortBy = OrderSortBy.LATEST,
  storeId,
  orderStatus,
  startDate,
  endDate,
  orderNumber,
  type,
}: Partial<OrderListQueryParams> & { page: number; limit: number; sortBy: OrderSortBy }) {
  const { addAlert } = useAlertStore();

  const query = useQuery<OrderListResponseDto>({
    queryKey: orderQueryKeys.list({
      page,
      limit,
      sortBy,
      storeId,
      orderStatus,
      startDate,
      endDate,
      orderNumber,
      type,
    }),
    queryFn: () => {
      const params: OrderListRequestDto = {
        page,
        limit,
        sortBy,
      };
      if (storeId) {
        params.storeId = storeId;
      }
      if (orderStatus) {
        params.orderStatus = orderStatus;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }
      if (orderNumber) {
        params.orderNumber = orderNumber;
      }
      if (type) {
        params.type = type;
      }
      return orderApi.getOrders(params);
    },
  });

  useEffect(() => {
    if (query.isError) {
      addAlert({
        severity: "error",
        message: getApiMessage.error(query.error),
      });
    }
  }, [query.isError, query.error, addAlert]);

  return query;
}

export function useOrderDetail(orderId: string) {
  const { addAlert } = useAlertStore();

  const query = useQuery<OrderResponseDto>({
    queryKey: orderQueryKeys.detail(orderId),
    queryFn: () => orderApi.getOrderDetail(orderId),
    enabled: !!orderId,
  });

  useEffect(() => {
    if (query.isError) {
      addAlert({
        severity: "error",
        message: getApiMessage.error(query.error),
      });
    }
  }, [query.isError, query.error, addAlert]);

  return query;
}
