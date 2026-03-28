import { OrderStatus } from "@apps/backend/infra/database/prisma/generated/client";

/** 영업·휴무 판정에 사용하는 타임존 (스토어·픽업 시각 기준) */
export const STORE_BUSINESS_CALENDAR_TIMEZONE = "Asia/Seoul";

/** HH:mm, 30분 단위 */
export const STORE_BUSINESS_TIME_HHMM_REGEX = /^([01]\d|2[0-3]):(00|30)$/;

/**
 * 시작·종료가 모두 00:00이면 ‘하루 전체(자정~자정, 모든 시각 포함)’ 영업으로 해석한다.
 * 그 외에는 종료 시각은 픽업 구간 상한(미포함)으로 쓴다.
 */
export function isStoreBusinessFullDayWindow(openHhmm: string, closeHhmm: string): boolean {
  return openHhmm === "00:00" && closeHhmm === "00:00";
}

/**
 * 영업시간 변경 시, 기존 픽업 예약과 충돌 여부를 검사할 주문 상태.
 * - 예약이 아직 ‘살아 있는’ 구간: 신청~픽업대기까지 (제작·방문 전)
 * - 제외: 픽업완료·노쇼·취소·환불 종료 등 종료 상태 — 이미 슬롯이 확정 소비되었거나 무효
 */
export const ORDER_STATUSES_BLOCKING_STORE_BUSINESS_CALENDAR_CHANGE: readonly OrderStatus[] = [
  OrderStatus.RESERVATION_REQUESTED,
  OrderStatus.PAYMENT_PENDING,
  OrderStatus.PAYMENT_COMPLETED,
  OrderStatus.CONFIRMED,
  OrderStatus.PICKUP_PENDING,
] as const;
