/**
 * 주문 자동 전환용 날짜·시간 유틸 (픽업 당일: Asia/Seoul 달력 기준)
 */
export const PAYMENT_PENDING_VALIDITY_MS = 12 * 60 * 60 * 1000;

/**
 * 입금대기 만료 여부 확인
 */
export function isPaymentPendingWindowExpired(createdAt: Date, now: Date): boolean {
  return now.getTime() - createdAt.getTime() >= PAYMENT_PENDING_VALIDITY_MS;
}

/**
 * 동일 달력 일자 여부 확인
 */
export function isSameCalendarDayKst(a: Date, b: Date): boolean {
  const da = a.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
  const db = b.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
  return da === db;
}
