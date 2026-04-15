/** 입금 마감 시각 미제공 시 폴백용 최대 12시간(백엔드 `PAYMENT_PENDING_MAX_VALIDITY_MS`와 동일) */
export const PAYMENT_PENDING_VALIDITY_MS = 12 * 60 * 60 * 1000;
