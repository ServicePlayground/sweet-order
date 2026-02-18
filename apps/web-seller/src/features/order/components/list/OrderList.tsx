import { useNavigate, useParams } from "react-router-dom";
import { OrderResponse, OrderStatus } from "@/apps/web-seller/features/order/types/order.type";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { BaseButton as Button } from "@/apps/web-seller/common/components/buttons/BaseButton";
import { useUpdateOrderStatus } from "@/apps/web-seller/features/order/hooks/mutations/useOrderMutation";
import { EmptyState } from "@/apps/web-seller/common/components/fallbacks/EmptyState";
import { StatusBadge } from "@/apps/web-seller/common/components/badges/StatusBadge";

interface OrderListProps {
  orders: OrderResponse[];
}

export function OrderList({ orders }: OrderListProps) {
  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();
  const updateOrderStatusMutation = useUpdateOrderStatus();

  const handleOrderClick = (orderId: string) => {
    if (storeId) {
      navigate(ROUTES.STORE_DETAIL_ORDERS_DETAIL(storeId, orderId));
    }
  };

  const handleConfirmOrder = async (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    updateOrderStatusMutation.mutate({
      orderId,
      request: { orderStatus: OrderStatus.CONFIRMED },
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <StatusBadge variant="warning">대기중</StatusBadge>;
      case OrderStatus.CONFIRMED:
        return <StatusBadge variant="success">확정됨</StatusBadge>;
      default:
        return null;
    }
  };

  if (orders.length === 0) {
    return <EmptyState message="주문이 없습니다." />;
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => {
        return (
          <div
            key={order.id}
            onClick={() => handleOrderClick(order.id)}
            className="group flex cursor-pointer items-center gap-4 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md"
          >
            {/* 주문 정보 */}
            <div className="flex flex-1 items-center justify-between gap-4">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <div className="text-sm font-semibold">{order.orderNumber}</div>
                  {getStatusBadge(order.orderStatus)}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>주문일: {new Date(order.createdAt).toLocaleDateString("ko-KR")}</span>
                  <span>수량: {order.totalQuantity}개</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">
                    {order.totalPrice.toLocaleString()}원
                  </div>
                </div>
                {order.orderStatus === OrderStatus.PENDING && (
                  <Button
                    size="sm"
                    onClick={(e) => handleConfirmOrder(e, order.id)}
                    disabled={updateOrderStatusMutation.isPending}
                  >
                    예약 확정
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
