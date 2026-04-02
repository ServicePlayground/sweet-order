import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/apps/web-seller/common/components/cards/Card";
import { BaseButton as Button } from "@/apps/web-seller/common/components/buttons/BaseButton";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { useStoreDetail } from "@/apps/web-seller/features/store/hooks/queries/useStoreQuery";
import {
  defaultBusinessCalendarDto,
  formatBusinessHoursShortLabel,
  overridesRecordFromApi,
  parseDateKey,
  toDateKey,
  type DayOverride,
  WEEKDAY_LABELS_KO,
} from "@/apps/web-seller/features/store/utils/store-calendar.util";
import { cn } from "@/apps/web-seller/common/utils/classname.util";

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function baseRuleForWeekday(
  weekday: number,
  weeklyOff: Set<number>,
  standardStart: string,
  standardEnd: string,
): { isOpen: boolean; start: string; end: string } {
  if (weeklyOff.has(weekday)) {
    return { isOpen: false, start: standardStart, end: standardEnd };
  }
  return { isOpen: true, start: standardStart, end: standardEnd };
}

function effectiveForDate(
  dateKey: string,
  weeklyOff: Set<number>,
  standardStart: string,
  standardEnd: string,
  overrides: Record<string, DayOverride>,
): DayOverride {
  const d = parseDateKey(dateKey);
  const w = d.getDay();
  const base = baseRuleForWeekday(w, weeklyOff, standardStart, standardEnd);
  const o = overrides[dateKey];
  if (o) return { ...o };
  return base;
}

export interface StoreBusinessCalendarPreviewProps {
  storeId: string;
  className?: string;
}

/**
 * 스토어 캘린더 페이지의 월 그리드와 동일한 읽기 전용 미리보기.
 * GET store 상세의 businessCalendar 기준입니다.
 */
export const StoreBusinessCalendarPreview: React.FC<StoreBusinessCalendarPreviewProps> = ({
  storeId,
  className,
}) => {
  const { data: store, isLoading, isError } = useStoreDetail(storeId);
  const [monthCursor, setMonthCursor] = React.useState(() => startOfMonth(new Date()));
  const [weeklyOff, setWeeklyOff] = React.useState<Set<number>>(() => new Set());
  const [standardStart, setStandardStart] = React.useState("00:00");
  const [standardEnd, setStandardEnd] = React.useState("00:00");
  const [overrides, setOverrides] = React.useState<Record<string, DayOverride>>({});

  const hydrateKeyRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!store?.id) return;
    const bc = store.businessCalendar ?? defaultBusinessCalendarDto();
    const fingerprint = `${store.id}-${store.updatedAt?.toString?.() ?? ""}-${JSON.stringify(bc)}`;
    if (hydrateKeyRef.current === fingerprint) return;
    hydrateKeyRef.current = fingerprint;
    setWeeklyOff(new Set(bc.weeklyClosedWeekdays));
    setStandardStart(bc.standardOpenTime);
    setStandardEnd(bc.standardCloseTime);
    setOverrides(
      overridesRecordFromApi(bc.dayOverrides, bc.standardOpenTime, bc.standardCloseTime),
    );
  }, [store]);

  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const dim = daysInMonth(monthCursor);

  const cells: ({ key: string; day: number } | null)[] = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= dim; day += 1) {
    const d = new Date(year, month, day);
    cells.push({ key: toDateKey(d), day });
  }

  const goPrevMonth = () => setMonthCursor(new Date(year, month - 1, 1));
  const goNextMonth = () => setMonthCursor(new Date(year, month + 1, 1));

  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden border-border bg-card", className)}>
        <CardHeader className="pb-2">
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <div className="mb-4 flex justify-between">
            <div className="h-9 w-9 animate-pulse rounded-md bg-zinc-200" />
            <div className="h-7 w-28 animate-pulse rounded bg-zinc-200" />
            <div className="h-9 w-9 animate-pulse rounded-md bg-zinc-200" />
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="min-h-[4.5rem] animate-pulse rounded-md bg-muted/50 sm:min-h-[5rem]"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !store) {
    return (
      <Card className={cn("border-border bg-card", className)}>
        <CardContent className="p-6 text-sm text-muted-foreground">
          캘린더 정보를 불러오지 못했습니다.{" "}
          <Link
            to={ROUTES.STORE_DETAIL_CALENDAR(storeId)}
            className="font-medium text-primary underline"
          >
            캘린더 보기
          </Link>
          에서 확인해 주세요.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden border-border bg-card", className)}>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0 pb-2 sm:items-center">
        <div className="min-w-0 space-y-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
            영업 캘린더
          </CardTitle>
        </div>
        <Button variant="outline" size="sm" className="shrink-0" asChild>
          <Link to={ROUTES.STORE_DETAIL_CALENDAR(storeId)}>캘린더 보기</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={goPrevMonth}
            aria-label="이전 달"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-xl font-semibold">
            {year}년 {month + 1}월
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={goNextMonth}
            aria-label="다음 달"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-sm font-semibold text-muted-foreground">
          {WEEKDAY_LABELS_KO.map((d) => (
            <div key={d} className="py-1.5">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((cell, i) => {
            if (!cell) {
              return <div key={`empty-${i}`} className="min-h-[5.25rem] sm:min-h-[5.75rem]" />;
            }
            const eff = effectiveForDate(
              cell.key,
              weeklyOff,
              standardStart,
              standardEnd,
              overrides,
            );
            const hasOverride = Boolean(overrides[cell.key]);
            return (
              <div
                key={cell.key}
                className={cn(
                  "flex min-h-[5.25rem] flex-col rounded-md border p-2 text-left transition-colors sm:min-h-[5.75rem] sm:p-2.5",
                  "border-border hover:bg-accent/50",
                  !eff.isOpen ? "bg-zinc-100 dark:bg-zinc-900/60" : "",
                )}
              >
                <span className="text-lg font-semibold leading-none tabular-nums text-foreground sm:text-xl">
                  {cell.day}
                </span>
                <div className="mt-auto flex flex-col gap-1 pt-1">
                  <span
                    className={cn(
                      "text-xs font-semibold leading-tight sm:text-sm",
                      hasOverride ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {hasOverride ? "개별 설정" : "기본 운영"}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium leading-tight sm:text-sm",
                      eff.isOpen
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400",
                    )}
                  >
                    {formatBusinessHoursShortLabel(eff.isOpen, eff.start, eff.end)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
