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
