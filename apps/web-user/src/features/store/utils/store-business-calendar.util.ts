import type { StoreBusinessCalendar } from "@/apps/web-user/features/store/types/store.type";

const STORE_BUSINESS_CALENDAR_TIMEZONE = "Asia/Seoul";

function isStoreBusinessFullDayWindow(openHhmm: string, closeHhmm: string): boolean {
  return openHhmm === "00:00" && closeHhmm === "00:00";
}

/**
 * Asia/Seoul 기준 달력 날짜·분·요일(0=일 … 6=토, JS Date.getDay()와 동일)
 */
function getSeoulWallClockForPickup(pickupUtc: Date): {
  dateKey: string;
  minuteOfDay: number;
  weekday: number;
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: STORE_BUSINESS_CALENDAR_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  }).formatToParts(pickupUtc);

  const v = (t: Intl.DateTimeFormatPart["type"]) => parts.find((p) => p.type === t)?.value ?? "";

  const month = v("month");
  const day = v("day");
  const year = v("year");
  const dateKey = `${year}-${month}-${day}`;

  const hour = Number.parseInt(v("hour"), 10);
  const minute = Number.parseInt(v("minute"), 10);
  const minuteOfDay = hour * 60 + minute;

  const wk = v("weekday").toLowerCase().replace(/\./g, "");
  const prefix3 = wk.slice(0, 3);
  const weekdayMap: Record<string, number> = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
  };
  const weekday = weekdayMap[prefix3] ?? 0;

  return { dateKey, minuteOfDay, weekday };
}

function parseHalfHourTimeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((x) => Number.parseInt(x, 10));
  return h * 60 + m;
}

/**
 * 픽업 시각이 영업 창 안이면 true.
 * - open/close가 모두 00:00 → 하루 전체(0≤분<24*60)
 * - 그 외 → [open, close) (종료 시각 미포함)
 */
function isMinuteWithinHalfHourWindow(
  minuteOfDay: number,
  openHhmm: string,
  closeHhmm: string,
): boolean {
  if (isStoreBusinessFullDayWindow(openHhmm, closeHhmm)) {
    return minuteOfDay >= 0 && minuteOfDay < 24 * 60;
  }
  const openM = parseHalfHourTimeToMinutes(openHhmm);
  const closeM = parseHalfHourTimeToMinutes(closeHhmm);
  return minuteOfDay >= openM && minuteOfDay < closeM;
}

/**
 * 현재 시각(UTC) 기준 Asia/Seoul에서 해당 스토어가 픽업/예약 가능한 영업 창 안이면 true.
 * (백엔드 pickupFitsBusinessCalendarState와 동일 규칙)
 */
export function isStoreOpenForPickupNow(
  calendar: StoreBusinessCalendar,
  at: Date = new Date(),
): boolean {
  const { dateKey, minuteOfDay, weekday } = getSeoulWallClockForPickup(at);

  const override = calendar.dayOverrides.find((o) => o.date === dateKey);
  if (override) {
    if (!override.isOpen) return false;
    if (!override.openTime || !override.closeTime) return false;
    return isMinuteWithinHalfHourWindow(minuteOfDay, override.openTime, override.closeTime);
  }

  if (calendar.weeklyClosedWeekdays.includes(weekday)) {
    return false;
  }

  return isMinuteWithinHalfHourWindow(
    minuteOfDay,
    calendar.standardOpenTime,
    calendar.standardCloseTime,
  );
}
