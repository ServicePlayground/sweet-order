/**
 * 브라우저 로컬 달력 `YYYY-MM-DD` ↔ `Date` (자정 로컬).
 * 서버 통계 기간 해석은 Asia/Seoul이나, 입력값은 주문 목록과 같이 `type="date"` 관례를 따릅니다.
 */

export function formatISODateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISODateLocal(): string {
  return formatISODateLocal(new Date());
}

/** `YYYY-MM-DD` → 해당 일의 로컬 자정 */
export function parseISODateLocal(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** 로컬 달력 기준으로 일 수만큼 이동 */
export function addDaysISODate(iso: string, delta: number): string {
  const d = parseISODateLocal(iso);
  d.setDate(d.getDate() + delta);
  return formatISODateLocal(d);
}

/** 시작·종료 포함 일수 */
export function countDaysInclusive(startIso: string, endIso: string): number {
  const a = parseISODateLocal(startIso).getTime();
  const b = parseISODateLocal(endIso).getTime();
  return Math.floor((b - a) / (24 * 60 * 60 * 1000)) + 1;
}

/** 월요일 시작 이번 주 첫날 */
export function startOfWeekMondayISO(fromIso: string): string {
  const d = parseISODateLocal(fromIso);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return formatISODateLocal(d);
}

/** 해당 월 1일 */
export function startOfMonthISO(fromIso: string): string {
  const d = parseISODateLocal(fromIso);
  return formatISODateLocal(new Date(d.getFullYear(), d.getMonth(), 1));
}
