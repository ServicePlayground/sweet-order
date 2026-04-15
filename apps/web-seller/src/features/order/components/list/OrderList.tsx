import { useNavigate, useParams } from "react-router-dom";
import { OrderResponseDto } from "@/apps/web-seller/features/order/types/order.dto";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { EmptyState } from "@/apps/web-seller/common/components/fallbacks/EmptyState";
import { StatusBadge } from "@/apps/web-seller/common/components/badges/StatusBadge";
import {
  getOrderStatusBadgeVariant,
  getOrderStatusLabel,
} from "@/apps/web-seller/features/order/utils/order-status-ui.util";

interface OrderListProps {
  orders: OrderResponseDto[];
}

export function OrderList({ orders }: OrderListProps) {
  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();

  const handleOrderClick = (orderId: string) => {
    if (storeId) {
      navigate(ROUTES.STORE_DETAIL_ORDERS_DETAIL(storeId, orderId));
    }
  };

  if (orders.length === 0) {
    return <EmptyState message="주문이 없습니다." />;
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => {
        const firstImage = order.productImages?.[0];
        return (
          <div
            key={order.id}
            onClick={() => handleOrderClick(order.id)}
            className="group flex cursor-pointer items-center gap-4 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-muted">
              {firstImage ? (
                <img
                  src={firstImage}
                  alt={order.productName || "주문 상품"}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs font-medium text-muted-foreground">
                  No Image
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="truncate text-sm font-semibold leading-tight">
                  {order.productName}
                </div>
                <div className="text-xs font-medium text-muted-foreground">{order.orderNumber}</div>
                <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                  <div>
                    주문 생성:{" "}
                    {new Date(order.createdAt).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                  <div>
                    픽업 일자:{" "}
                    {new Date(order.pickupDate).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
                <StatusBadge variant={getOrderStatusBadgeVariant(order.orderStatus)}>
                  {getOrderStatusLabel(order.orderStatus)}
                </StatusBadge>
                <div className="text-base font-bold tabular-nums sm:text-lg">
                  {order.totalPrice.toLocaleString()}원
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
