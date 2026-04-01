/**
 * 통계 화면의 `startDate`/`endDate`와 프리셋 하이라이트 상태. 날짜 문자열은 브라우저 로컬 `YYYY-MM-DD`입니다.
 */
import { useCallback, useState } from "react";
import {
  STATISTICS_ACCUMULATED_DAY_OFFSET,
  STATISTICS_DEFAULT_DAY_OFFSET,
} from "@/apps/web-seller/features/statistics/constants/statistics.constant";
import {
  addDaysISODate,
  startOfMonthISO,
  startOfWeekMondayISO,
  todayISODateLocal,
} from "@/apps/web-seller/features/statistics/utils/statistics-date.util";

export type StatisticsRangePreset = "accumulated" | "month" | "week" | "today" | "custom";

/** 최초 마운트 시 기본 구간(오늘 포함 약 1주). */
export function defaultStatisticsDateRange(): { startDate: string; endDate: string } {
  const end = todayISODateLocal();
  return { startDate: addDaysISODate(end, STATISTICS_DEFAULT_DAY_OFFSET), endDate: end };
}

/** 프리셋 클릭 시 오늘 기준으로 구간을 다시 계산합니다. */
export function useStatisticsOverviewRangeState() {
  const [{ startDate, endDate }, setRange] = useState(defaultStatisticsDateRange);
  const [selectedPreset, setSelectedPreset] = useState<StatisticsRangePreset>("custom");

  const applyAccumulated = useCallback(() => {
    const end = todayISODateLocal();
    const start = addDaysISODate(end, STATISTICS_ACCUMULATED_DAY_OFFSET);
    setSelectedPreset("accumulated");
    setRange({ startDate: start, endDate: end });
  }, []);

  const applyThisMonth = useCallback(() => {
    const end = todayISODateLocal();
    const start = startOfMonthISO(end);
    setSelectedPreset("month");
    setRange({ startDate: start, endDate: end });
  }, []);

  const applyThisWeek = useCallback(() => {
    const end = todayISODateLocal();
    const start = startOfWeekMondayISO(end);
    setSelectedPreset("week");
    setRange({ startDate: start, endDate: end });
  }, []);

  const applyToday = useCallback(() => {
    const end = todayISODateLocal();
    setSelectedPreset("today");
    setRange({ startDate: end, endDate: end });
  }, []);

  const markCustom = useCallback(() => {
    setSelectedPreset("custom");
  }, []);

  return {
    startDate,
    endDate,
    setRange,
    selectedPreset,
    applyAccumulated,
    applyThisMonth,
    applyThisWeek,
    applyToday,
    markCustom,
  };
}
