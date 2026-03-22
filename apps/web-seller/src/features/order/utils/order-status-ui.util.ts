import type { StatusBadgeVariant } from "@/apps/web-seller/common/components/badges/StatusBadge";
import { OrderStatus } from "@/apps/web-seller/features/order/types/order.dto";

const LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PAYMENT_PENDING]: "입금대기",
  [OrderStatus.PAYMENT_COMPLETED]: "입금완료",
  [OrderStatus.CONFIRMED]: "예약확정",
  [OrderStatus.PICKUP_PENDING]: "픽업대기",
  [OrderStatus.PICKUP_COMPLETED]: "픽업완료",
  [OrderStatus.CANCEL_COMPLETED]: "취소완료",
  [OrderStatus.CANCEL_REFUND_PENDING]: "취소환불대기",
  [OrderStatus.CANCEL_REFUND_COMPLETED]: "취소환불완료",
  [OrderStatus.NO_SHOW]: "노쇼",
};

export function getOrderStatusLabel(status: OrderStatus): string {
  return LABELS[status] ?? status;
}

export function getOrderStatusBadgeVariant(status: OrderStatus): StatusBadgeVariant {
  switch (status) {
    case OrderStatus.PAYMENT_PENDING:
      return "warning";
    case OrderStatus.PAYMENT_COMPLETED:
    case OrderStatus.PICKUP_PENDING:
      return "info";
    case OrderStatus.CONFIRMED:
    case OrderStatus.PICKUP_COMPLETED:
      return "success";
    case OrderStatus.CANCEL_COMPLETED:
    case OrderStatus.CANCEL_REFUND_PENDING:
    case OrderStatus.CANCEL_REFUND_COMPLETED:
    case OrderStatus.NO_SHOW:
      return "error";
    default:
      return "default";
  }
}

/** 목록·필터용: 전체 상태 옵션 */
export const ORDER_STATUS_FILTER_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: OrderStatus.PAYMENT_PENDING, label: LABELS[OrderStatus.PAYMENT_PENDING] },
  { value: OrderStatus.PAYMENT_COMPLETED, label: LABELS[OrderStatus.PAYMENT_COMPLETED] },
  { value: OrderStatus.CONFIRMED, label: LABELS[OrderStatus.CONFIRMED] },
  { value: OrderStatus.PICKUP_PENDING, label: LABELS[OrderStatus.PICKUP_PENDING] },
  { value: OrderStatus.PICKUP_COMPLETED, label: LABELS[OrderStatus.PICKUP_COMPLETED] },
  { value: OrderStatus.CANCEL_REFUND_PENDING, label: LABELS[OrderStatus.CANCEL_REFUND_PENDING] },
  { value: OrderStatus.CANCEL_REFUND_COMPLETED, label: LABELS[OrderStatus.CANCEL_REFUND_COMPLETED] },
  { value: OrderStatus.CANCEL_COMPLETED, label: LABELS[OrderStatus.CANCEL_COMPLETED] },
  { value: OrderStatus.NO_SHOW, label: LABELS[OrderStatus.NO_SHOW] },
];
