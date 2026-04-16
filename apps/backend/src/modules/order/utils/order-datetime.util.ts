/**
 * 주문 자동 전환용 날짜·시간 유틸
 */

/** 레거시·픽업 미정 시 사용하는 입금대기 최대 유효 기간(픽업이 12시간보다 멀 때) */
export const PAYMENT_PENDING_MAX_VALIDITY_MS = 12 * 60 * 60 * 1000;

const MS_1H = 60 * 60 * 1000;
const MS_6H = 6 * MS_1H;
const MS_12H = 12 * MS_1H;

/** @deprecated `PAYMENT_PENDING_MAX_VALIDITY_MS` 사용. 하위 호환용 별칭 */
export const PAYMENT_PENDING_VALIDITY_MS = PAYMENT_PENDING_MAX_VALIDITY_MS;

export type PaymentPendingExpiryInput = {
  paymentPendingDeadlineAt: Date | null;
  paymentPendingAt: Date | null;
  createdAt: Date;
  pickupDate: Date | null;
};

/**
 * 입금대기 전환 시각 기준, 픽업까지 남은 시간에 따른 허용 입금 구간 길이를 반영한 마감 시각.
 * - 픽업까지 12시간 초과: 최대 12시간
 * - 픽업까지 6시간 초과 ~ 12시간 이하: 최대 6시간
 * - 픽업까지 6시간 이하: 최대 1시간
 * 픽업 시각이 더 이르면 `min(전환시각 + 허용구간, 픽업시각)`입니다.
 */
export function computePaymentPendingDeadline(
  paymentPendingAt: Date,
  pickupDate: Date | null,
): Date {
  const t0 = paymentPendingAt.getTime();
  if (!pickupDate) {
    return new Date(t0 + MS_12H);
  }
  const p = pickupDate.getTime();
  const delta = p - t0;
  let durationMs: number;
  if (delta > MS_12H) {
    durationMs = MS_12H;
  } else if (delta > MS_6H) {
    durationMs = MS_6H;
  } else {
    durationMs = MS_1H;
  }
  return new Date(Math.min(t0 + durationMs, p));
}

/**
 * 입금대기 유효 기준 시작 시각. 판매자가 입금대기로 바꾼 뒤부터만 사용하고, 값이 없으면 레거시 입금대기 주문용으로 `createdAt`을 씁니다.
 */
export function paymentPendingWindowStart(paymentPendingAt: Date | null, createdAt: Date): Date {
  return paymentPendingAt ?? createdAt;
}

/**
 * 저장된 마감이 없을 때(배포 직전 데이터 등) 동일 규칙으로 마감 시각을 복원합니다.
 */
export function resolvePaymentPendingDeadline(input: PaymentPendingExpiryInput): Date {
  if (input.paymentPendingDeadlineAt) {
    return input.paymentPendingDeadlineAt;
  }
  const start = paymentPendingWindowStart(input.paymentPendingAt, input.createdAt);
  return computePaymentPendingDeadline(start, input.pickupDate);
}

export function isPaymentPendingExpired(now: Date, input: PaymentPendingExpiryInput): boolean {
  return now.getTime() >= resolvePaymentPendingDeadline(input).getTime();
}

/**
 * 픽업대기 자동 전환 시점 도달 여부 확인
 */
export function isPickupPendingDue(pickupDate: Date, now: Date): boolean {
  return now.getTime() >= pickupDate.getTime();
}
