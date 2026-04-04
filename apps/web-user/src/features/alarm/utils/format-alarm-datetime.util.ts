const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** `d`가 로컬 기준 `now`의 전날인지 */
function isYesterdayLocal(d: Date, now: Date): boolean {
  const y = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  return isSameLocalDay(d, y);
}

function formatKoreanMeridiemTime(d: Date): string {
  const h = d.getHours();
  const min = d.getMinutes();
  const period = h >= 12 ? "오후" : "오전";
  const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${period} ${hour12}:${String(min).padStart(2, "0")}`;
}

function formatDateDot(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}.${String(m).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
}

/**
 * 알림 목록 우측 시간 영역 (로컬 타임존).
 * - 1분 미만: `방금` (date 비움)
 * - 1시간 미만: `N분 전`
 * - 오늘·1시간 이상 경과: 시각만 (예: 오후 3:45, date 비움)
 * - 어제: date `어제` + 시각
 * - 그전: 날짜(YYYY.MM.DD) + 시각
 */
export function formatAlarmListLabels(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const now = new Date();

  if (Number.isNaN(d.getTime())) {
    return { date: "", time: "" };
  }

  const diffMs = now.getTime() - d.getTime();

  if (diffMs < 0) {
    return { date: formatDateDot(d), time: formatKoreanMeridiemTime(d) };
  }

  if (diffMs < MINUTE_MS) {
    return { date: "", time: "방금" };
  }

  if (diffMs < HOUR_MS) {
    const minutes = Math.floor(diffMs / MINUTE_MS);
    return { date: "", time: `${minutes}분 전` };
  }

  if (isSameLocalDay(d, now)) {
    return { date: "", time: formatKoreanMeridiemTime(d) };
  }

  if (isYesterdayLocal(d, now)) {
    return { date: "어제", time: formatKoreanMeridiemTime(d) };
  }

  return {
    date: formatDateDot(d),
    time: formatKoreanMeridiemTime(d),
  };
}
