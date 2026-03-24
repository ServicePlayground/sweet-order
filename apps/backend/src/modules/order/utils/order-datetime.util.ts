/**
 * 주문 자동 전환용 날짜·시간 유틸
 */
export const PAYMENT_PENDING_VALIDITY_MS = 12 * 60 * 60 * 1000;

/**
 * 입금대기 만료 여부 확인
 */
export function isPaymentPendingWindowExpired(createdAt: Date, now: Date): boolean {
  return now.getTime() - createdAt.getTime() >= PAYMENT_PENDING_VALIDITY_MS;
}

/**
 * 픽업대기 자동 전환 시점 도달 여부 확인
 */
export function isPickupPendingDue(pickupDate: Date, now: Date): boolean {
  return now.getTime() >= pickupDate.getTime();
}
