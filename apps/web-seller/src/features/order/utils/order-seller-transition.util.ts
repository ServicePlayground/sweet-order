import { OrderStatus } from "@/apps/web-seller/features/order/types/order.dto";

const SELLER_SETTABLE = new Set<OrderStatus>([
  OrderStatus.CONFIRMED,
  OrderStatus.PICKUP_COMPLETED,
  OrderStatus.NO_SHOW,
  OrderStatus.CANCEL_COMPLETED,
  OrderStatus.CANCEL_REFUND_PENDING,
  OrderStatus.CANCEL_REFUND_COMPLETED,
]);

const CONFIRMED_FROM = new Set<OrderStatus>([
  OrderStatus.PAYMENT_PENDING,
  OrderStatus.PAYMENT_COMPLETED,
]);

const PICKUP_COMPLETED_FROM = new Set<OrderStatus>([
  OrderStatus.CONFIRMED,
  OrderStatus.PICKUP_PENDING,
]);
const NO_SHOW_FROM = new Set<OrderStatus>([OrderStatus.PICKUP_PENDING]);
const CANCEL_COMPLETED_FROM = new Set<OrderStatus>([OrderStatus.PAYMENT_PENDING]);
const CANCEL_REFUND_PENDING_FROM = new Set<OrderStatus>([
  OrderStatus.PAYMENT_COMPLETED,
  OrderStatus.CONFIRMED,
  OrderStatus.PICKUP_PENDING,
]);
const CANCEL_REFUND_COMPLETED_FROM = new Set<OrderStatus>([OrderStatus.CANCEL_REFUND_PENDING]);

/** 백엔드 `isSellerTransitionAllowed`와 동일 규칙 */
export function isSellerTransitionAllowed(from: OrderStatus, to: OrderStatus): boolean {
  if (!SELLER_SETTABLE.has(to)) {
    return false;
  }
  if (to === OrderStatus.CONFIRMED && !CONFIRMED_FROM.has(from)) {
    return false;
  }
  if (to === OrderStatus.PICKUP_COMPLETED && !PICKUP_COMPLETED_FROM.has(from)) {
    return false;
  }
  if (to === OrderStatus.NO_SHOW && !NO_SHOW_FROM.has(from)) {
    return false;
  }
  if (to === OrderStatus.CANCEL_COMPLETED && !CANCEL_COMPLETED_FROM.has(from)) {
    return false;
  }
  if (to === OrderStatus.CANCEL_REFUND_PENDING && !CANCEL_REFUND_PENDING_FROM.has(from)) {
    return false;
  }
  if (to === OrderStatus.CANCEL_REFUND_COMPLETED && !CANCEL_REFUND_COMPLETED_FROM.has(from)) {
    return false;
  }
  return true;
}
