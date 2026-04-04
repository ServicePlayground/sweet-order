/**
 * 스토어 홈용 주문 통계 요약. 누적(오늘 포함 최근 90일) 고정, 기간 선택 UI 없음.
 * 요일·시간대 차트는 통계 상세 화면에서만 표시합니다.
 */
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/apps/web-seller/common/components/cards/Card";
import { BaseButton as Button } from "@/apps/web-seller/common/components/buttons/BaseButton";
import { STATISTICS_ACCUMULATED_DAY_OFFSET } from "@/apps/web-seller/features/statistics/constants/statistics.constant";
import { useStatisticsOverviewQuery } from "@/apps/web-seller/features/statistics/hooks/queries/useStatisticsOverviewQuery";
import {
  addDaysISODate,
  todayISODateLocal,
} from "@/apps/web-seller/features/statistics/utils/statistics-date.util";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";

export interface StoreHomeStatisticsSectionProps {
  storeId: string;
}

const statCardHeader =
  "flex flex-row flex-wrap items-start justify-between gap-3 space-y-0 pb-2 sm:items-center";

function formatRangeLabel(startIso: string, endIso: string): string {
  const fmt = (iso: string) => {
    const [y, m, d] = iso.split("-").map((v) => parseInt(v, 10));
    return `${y}년 ${m}월 ${d}일`;
  };
  return `${fmt(startIso)} ~ ${fmt(endIso)} · 누적(최근 90일)`;
}

export const StoreHomeStatisticsSection: React.FC<StoreHomeStatisticsSectionProps> = ({
  storeId,
}) => {
  const { startDate, endDate, rangeLabel } = useMemo(() => {
    const end = todayISODateLocal();
    const start = addDaysISODate(end, STATISTICS_ACCUMULATED_DAY_OFFSET);
    return {
      startDate: start,
      endDate: end,
      rangeLabel: formatRangeLabel(start, end),
    };
  }, []);

  const { data, isLoading, isError, isFetching, refetch } = useStatisticsOverviewQuery({
    storeId,
    startDate,
    endDate,
  });

  const totalSales = data?.totalSales ?? 0;
  const totalOrders = data?.totalOrders ?? 0;
  const topProductsByRevenue = data?.topProductsByRevenue ?? [];
  const topProductsByOrders = data?.topProductsByOrders ?? [];

  const emptyHint = "해당 기간에 집계된 데이터가 없습니다.";

  return (
    <section className="w-full border-t border-border pt-6">
      <Card className="w-full border-border bg-card">
        <CardHeader className={statCardHeader}>
          <div className="min-w-0 space-y-1">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <BarChart3 className="h-4 w-4 shrink-0 text-primary" />
              주문 통계
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{rangeLabel}</span>
              {isFetching && !isLoading ? (
                <span className="ml-2 text-xs text-muted-foreground">· 업데이트 중…</span>
              ) : null}
            </p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0" asChild>
            <Link to={ROUTES.STORE_DETAIL_STATISTICS_ORDERS(storeId)}>통계 보기</Link>
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 pt-0">
          {isLoading ? (
            <div className="flex w-full items-center justify-center rounded-lg border border-border bg-muted/20 py-14">
              <p className="text-sm text-muted-foreground">통계를 불러오는 중...</p>
            </div>
          ) : isError ? (
            <div className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border border-border bg-muted/20 py-14">
              <p className="text-sm text-destructive">
                통계를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
              </p>
              <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
                다시 시도
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="border-border bg-card shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      매출
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold tabular-nums tracking-tight">
                      ₩{totalSales.toLocaleString("ko-KR")}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-border bg-card shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      주문 건수
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold tabular-nums tracking-tight">
                      {totalOrders.toLocaleString("ko-KR")}건
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="border-border bg-card shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">매출 순</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {topProductsByRevenue.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{emptyHint}</p>
                    ) : (
                      topProductsByRevenue.map((p, i) => (
                        <div
                          key={p.productId}
                          className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/20 px-3 py-2.5"
                        >
                          <p className="truncate text-sm font-medium">
                            {i + 1}. {p.productName}
                          </p>
                          <p className="text-sm font-semibold tabular-nums">
                            ₩{p.revenue.toLocaleString("ko-KR")}
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
                <Card className="border-border bg-card shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">주문 건수 순</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {topProductsByOrders.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{emptyHint}</p>
                    ) : (
                      topProductsByOrders.map((p, i) => (
                        <div
                          key={p.productId}
                          className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/20 px-3 py-2.5"
                        >
                          <p className="truncate text-sm font-medium">
                            {i + 1}. {p.productName}
                          </p>
                          <p className="text-sm font-semibold tabular-nums">
                            {p.orderCount.toLocaleString("ko-KR")}건
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
};
