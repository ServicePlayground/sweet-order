/** 통계 기간 빠른 선택(누적·이번 달·이번 주·오늘). 실제 날짜 계산은 `useStatisticsOverviewRangeState`에서 합니다. */
import React from "react";
import { cn } from "@/apps/web-seller/common/utils/classname.util";
import type { StatisticsRangePreset } from "@/apps/web-seller/features/statistics/hooks/useStatisticsOverviewRangeState";

export interface StatisticsRangePresetButtonsProps {
  selectedPreset: StatisticsRangePreset;
  onAccumulated: () => void;
  onThisMonth: () => void;
  onThisWeek: () => void;
  onToday: () => void;
}

const presetButtonClass = (active: boolean) =>
  cn(
    "inline-flex h-9 w-full items-center justify-center rounded-lg border px-3 text-xs font-medium transition-all",
    active
      ? "border-violet-300 bg-violet-50 text-violet-700 shadow-sm dark:border-violet-400/50 dark:bg-violet-500/15 dark:text-violet-200"
      : "border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground",
  );

export const StatisticsRangePresetButtons: React.FC<StatisticsRangePresetButtonsProps> = ({
  selectedPreset,
  onAccumulated,
  onThisMonth,
  onThisWeek,
  onToday,
}) => {
  return (
    <div className="grid w-full max-w-[720px] grid-cols-2 gap-2 rounded-xl border border-border bg-background p-1.5 sm:grid-cols-4">
      <button
        type="button"
        onClick={onAccumulated}
        className={presetButtonClass(selectedPreset === "accumulated")}
      >
        누적
      </button>
      <button
        type="button"
        onClick={onThisMonth}
        className={presetButtonClass(selectedPreset === "month")}
      >
        이번달
      </button>
      <button
        type="button"
        onClick={onThisWeek}
        className={presetButtonClass(selectedPreset === "week")}
      >
        이번주
      </button>
      <button
        type="button"
        onClick={onToday}
        className={presetButtonClass(selectedPreset === "today")}
      >
        오늘
      </button>
    </div>
  );
};
