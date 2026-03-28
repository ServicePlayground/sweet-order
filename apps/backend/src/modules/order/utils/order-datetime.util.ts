/**
 * 주문 자동 전환용 날짜·시간 유틸
 */
export const PAYMENT_PENDING_VALIDITY_MS = 12 * 60 * 60 * 1000;

/**
 * 입금대기 12시간 만료 여부
 * @param windowStartAt 입금대기 진입 시각(`paymentPendingAt` 또는 레거시 시 `createdAt`)
 */
export function isPaymentPendingWindowExpired(windowStartAt: Date, now: Date): boolean {
  return now.getTime() - windowStartAt.getTime() >= PAYMENT_PENDING_VALIDITY_MS;
}

/**
 * 입금대기 유효 기준 시작 시각. 판매자가 입금대기로 바꾼 뒤부터만 사용하고, 값이 없으면 레거시 입금대기 주문용으로 `createdAt`을 씁니다.
 */
export function paymentPendingWindowStart(paymentPendingAt: Date | null, createdAt: Date): Date {
  return paymentPendingAt ?? createdAt;
}

/**
 * 픽업대기 자동 전환 시점 도달 여부 확인
 */
export function isPickupPendingDue(pickupDate: Date, now: Date): boolean {
  return now.getTime() >= pickupDate.getTime();
}
