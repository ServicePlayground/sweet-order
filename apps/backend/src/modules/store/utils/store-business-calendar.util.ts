import {
  STORE_BUSINESS_CALENDAR_TIMEZONE,
  STORE_BUSINESS_TIME_HHMM_REGEX,
  isStoreBusinessFullDayWindow,
} from "@apps/backend/modules/store/constants/store-business-calendar.constants";

export type StoreBusinessDayOverrideInput = {
  date: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
};

export type StoreBusinessCalendarState = {
  weeklyClosedWeekdays: number[];
  standardOpenTime: string;
  standardCloseTime: string;
  dayOverrides: StoreBusinessDayOverrideInput[];
};

/**
 * Asia/Seoul 기준 달력 날짜·분·요일(0=일 … 6=토, JS Date.getDay()와 동일)
 */
export function getSeoulWallClockForPickup(pickupUtc: Date): {
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

export function parseHalfHourTimeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((x) => Number.parseInt(x, 10));
  return h * 60 + m;
}

/**
 * 픽업 시각이 영업 창 안이면 true.
 * - open/close가 모두 00:00 → 하루 전체(0≤분<24*60)
 * - 그 외 → [open, close) (종료 시각 미포함)
 */
export function isMinuteWithinHalfHourWindow(
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

export function isValidHalfHourHhmm(value: string): boolean {
  return STORE_BUSINESS_TIME_HHMM_REGEX.test(value);
}

/**
 * 제안된 영업 설정 하에서 해당 픽업 시각이 ‘영업·슬롯 가능’이면 true.
 * 휴무이거나 시간 밖이면 false.
 */
export function pickupFitsBusinessCalendarState(
  pickupUtc: Date,
  state: StoreBusinessCalendarState,
): boolean {
  const { dateKey, minuteOfDay, weekday } = getSeoulWallClockForPickup(pickupUtc);

  const override = state.dayOverrides.find((o) => o.date === dateKey);
  if (override) {
    if (!override.isOpen) return false;
    if (!override.openTime || !override.closeTime) return false;
    return isMinuteWithinHalfHourWindow(minuteOfDay, override.openTime, override.closeTime);
  }

  if (state.weeklyClosedWeekdays.includes(weekday)) {
    return false;
  }

  return isMinuteWithinHalfHourWindow(minuteOfDay, state.standardOpenTime, state.standardCloseTime);
}

/** DB JSON → 정규화(날짜 오름차순, 동일 날짜는 뒤 항목 우선) */
export function normalizeDayOverridesFromJson(raw: unknown): StoreBusinessDayOverrideInput[] {
  if (!Array.isArray(raw)) return [];
  const out: StoreBusinessDayOverrideInput[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const date = typeof r.date === "string" ? r.date : "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    const isOpen = Boolean(r.isOpen);
    const openTime = typeof r.openTime === "string" ? r.openTime : undefined;
    const closeTime = typeof r.closeTime === "string" ? r.closeTime : undefined;
    out.push({ date, isOpen, openTime, closeTime });
  }
  out.sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map<string, StoreBusinessDayOverrideInput>();
  for (const o of out) {
    byDate.set(o.date, o);
  }
  return [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([, v]) => v);
}

export function businessCalendarStateFromStoreRow(row: {
  weeklyClosedWeekdays: number[];
  standardOpenTime: string;
  standardCloseTime: string;
  businessCalendarOverrides: unknown;
}): StoreBusinessCalendarState {
  return {
    weeklyClosedWeekdays: [...row.weeklyClosedWeekdays].sort((a, b) => a - b),
    standardOpenTime: row.standardOpenTime,
    standardCloseTime: row.standardCloseTime,
    dayOverrides: normalizeDayOverridesFromJson(row.businessCalendarOverrides),
  };
}

/** API 응답용 (휴무일은 open/close 생략 가능) */
export function toStoreBusinessCalendarApiShape(state: StoreBusinessCalendarState): {
  weeklyClosedWeekdays: number[];
  standardOpenTime: string;
  standardCloseTime: string;
  dayOverrides: StoreBusinessDayOverrideInput[];
} {
  return {
    weeklyClosedWeekdays: state.weeklyClosedWeekdays,
    standardOpenTime: state.standardOpenTime,
    standardCloseTime: state.standardCloseTime,
    dayOverrides: state.dayOverrides.map((o) => ({
      date: o.date,
      isOpen: o.isOpen,
      ...(o.isOpen ? { openTime: o.openTime, closeTime: o.closeTime } : {}),
    })),
  };
}
