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

            <div className="flex flex-1 items-center justify-between gap-4">
              <div className="flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <div className="text-sm font-semibold">{order.productName}</div>
                  <StatusBadge variant={getOrderStatusBadgeVariant(order.orderStatus)}>
                    {getOrderStatusLabel(order.orderStatus)}
                  </StatusBadge>
                </div>
                <div className="text-sm font-semibold">{order.orderNumber}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-foreground">
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
