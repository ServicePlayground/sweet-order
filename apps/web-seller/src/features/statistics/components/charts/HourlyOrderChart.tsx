/**
 * 0~23시 건수 배열을 세로 막대로 표시. `statistics-chart.util`의 `hourlyOrdersToValues24` 출력과 맞춥니다.
 */
import React from "react";
import { cn } from "@/apps/web-seller/common/utils/classname.util";

interface HourlyOrderChartProps {
  /** 길이 24 권장(인덱스 = 시각) */
  values: readonly number[];
  className?: string;
}

export const HourlyOrderChart: React.FC<HourlyOrderChartProps> = ({ values, className }) => {
  const max = Math.max(...values, 1);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex h-[140px] items-end justify-between gap-0.5 sm:gap-1">
        {values.map((v, i) => {
          const h = Math.max(Math.round((v / max) * 100), 4);
          return (
            <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <div className="flex h-[112px] w-full items-end justify-center">
                <div
                  className="w-full max-w-[18px] rounded-t-md bg-gradient-to-t from-slate-600/30 to-sky-500/90 transition hover:to-sky-400"
                  style={{ height: `${h}%` }}
                  title={`${i}시 · 약 ${v}`}
                />
              </div>
              <span className="text-[9px] tabular-nums text-muted-foreground sm:text-[10px]">
                {i}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex justify-between border-t border-border/50 pt-2 text-[10px] text-muted-foreground sm:text-xs">
        <span>0시</span>
        <span>12시</span>
        <span>23시</span>
      </div>
    </div>
  );
};
