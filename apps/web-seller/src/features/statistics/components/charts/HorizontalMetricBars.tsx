/** 라벨·값 나열 + 최댓값 대비 가로 막대(요일별 매출/건수 등). */
import React from "react";
import { cn } from "@/apps/web-seller/common/utils/classname.util";

export interface HorizontalMetricItem {
  label: string;
  value: number;
}

interface HorizontalMetricBarsProps {
  items: readonly HorizontalMetricItem[];
  formatValue: (n: number) => string;
  className?: string;
  variant?: "violet" | "emerald";
}

export const HorizontalMetricBars: React.FC<HorizontalMetricBarsProps> = ({
  items,
  formatValue,
  className,
  variant = "violet",
}) => {
  const max = Math.max(...items.map((i) => i.value), 1);
  const grad =
    variant === "emerald"
      ? "bg-gradient-to-r from-emerald-500/80 to-teal-600/90"
      : "bg-gradient-to-r from-primary/70 via-primary to-violet-500/90";

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item) => {
        const pct = Math.round((item.value / max) * 100);
        // 0건이어도 막대가 보이도록 최소 너비 유지
        return (
          <div key={item.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium text-foreground">{item.label}</span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {formatValue(item.value)}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted/80">
              <div
                className={cn("h-full rounded-full transition-all duration-500", grad)}
                style={{ width: `${Math.max(pct, 3)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
