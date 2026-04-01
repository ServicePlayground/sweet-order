/** 기간 선택: 시작·종료 포함 최대 일수 */
export const STATISTICS_MAX_RANGE_DAYS = 120;

/** '누적' 프리셋: 오늘 포함 며칠 구간인지에 맞춘 `addDays` 오프셋 (오늘 + 과거 89일 = 90일) */
export const STATISTICS_ACCUMULATED_DAY_OFFSET = -89;

/** 첫 진입 기본 기간: 오늘 기준 며칠 전부터 (포함 일수 = 이 값 + 1) */
export const STATISTICS_DEFAULT_DAY_OFFSET = -6;

/** 주문 통계 개요 React Query staleTime */
export const STATISTICS_OVERVIEW_STALE_TIME_MS = 60_000;
