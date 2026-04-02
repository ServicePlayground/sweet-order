import { STORE_BUSINESS_CALENDAR_TIMEZONE } from "@apps/backend/modules/store/constants/store-business-calendar.constants";

/**
 * Asia/Seoul 기준 오늘 날짜 (YYYY-MM-DD).
 * 주문 픽업일 필터(`pickupStartDate`/`pickupEndDate`)와 동일한 달력 기준입니다.
 */
export function getSeoulTodayYmd(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: STORE_BUSINESS_CALENDAR_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
