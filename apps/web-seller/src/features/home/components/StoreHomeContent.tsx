import React from "react";
import { Link } from "react-router-dom";
import { Bell, CalendarDays } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/apps/web-seller/common/components/cards/Card";
import { BaseButton as Button } from "@/apps/web-seller/common/components/buttons/BaseButton";
import { StatusBadge } from "@/apps/web-seller/common/components/badges/StatusBadge";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import {
  getOrderStatusBadgeVariant,
  getOrderStatusLabel,
} from "@/apps/web-seller/features/order/utils/order-status-ui.util";
import { StoreHomeStoreProfile } from "@/apps/web-seller/features/home/components/StoreHomeStoreProfile";
import { StoreBusinessCalendarPreview } from "@/apps/web-seller/features/store/components/calendar/StoreBusinessCalendarPreview";
import { StoreHomeStatisticsSection } from "@/apps/web-seller/features/home/components/StoreHomeStatisticsSection";
import { useStoreHomeDashboardQuery } from "@/apps/web-seller/features/home/hooks/queries/useStoreHomeDashboardQuery";
import { feedContentToExcerpt } from "@/apps/web-seller/features/home/utils/feed-excerpt.util";

export interface StoreHomeContentProps {
  storeId: string;
}

const homeCardHeader =
  "flex flex-row flex-wrap items-start justify-between gap-3 space-y-0 pb-2 sm:items-center";

export const StoreHomeContent: React.FC<StoreHomeContentProps> = ({ storeId }) => {
  const { data: home, isLoading, isError } = useStoreHomeDashboardQuery(storeId);

  const recentOrders = home?.recentOrders ?? [];
  const todayPickups = home?.todayPickups ?? [];
  const recentNotifications = home?.recentNotifications ?? [];
  const recentFeeds = home?.recentFeeds ?? [];

  return (
    <div className="space-y-6">
      <StoreHomeStoreProfile storeId={storeId} />

      <StoreBusinessCalendarPreview storeId={storeId} className="w-full" />

      <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="border-border bg-card xl:col-span-2">
          <CardHeader className={homeCardHeader}>
            <div className="min-w-0">
              <CardTitle className="text-base">최근 주문</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" asChild>
              <Link to={ROUTES.STORE_DETAIL_ORDERS_LIST(storeId)}>주문 보기</Link>
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto px-0 sm:px-6">
            {isLoading ? (
              <p className="px-6 py-8 text-sm text-muted-foreground">불러오는 중…</p>
            ) : isError ? (
              <p className="px-6 py-8 text-sm text-destructive">목록을 불러오지 못했습니다.</p>
            ) : recentOrders.length === 0 ? (
              <p className="px-6 py-8 text-sm text-muted-foreground">표시할 주문이 없습니다.</p>
            ) : (
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="px-6 py-2 font-medium">주문번호</th>
                    <th className="py-2 pr-4 font-medium">상품</th>
                    <th className="py-2 pr-4 font-medium">금액</th>
                    <th className="py-2 pr-4 font-medium">상태</th>
                    <th className="py-2 pr-4 font-medium">픽업</th>
                    <th className="py-2 pr-6 font-medium">접수</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((row) => (
                    <tr key={row.id} className="border-b border-border/80 last:border-0">
                      <td className="px-6 py-3 font-mono text-xs text-foreground">
                        {row.orderNumber}
                      </td>
                      <td className="max-w-[200px] truncate py-3 pr-4 text-foreground">
                        {row.productName}
                      </td>
                      <td className="py-3 pr-4 tabular-nums text-foreground">
                        ₩{row.totalPrice.toLocaleString("ko-KR")}
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge variant={getOrderStatusBadgeVariant(row.orderStatus)}>
                          {getOrderStatusLabel(row.orderStatus)}
                        </StatusBadge>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {row.pickupDate != null
                          ? new Date(row.pickupDate).toLocaleString("ko-KR", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                      <td className="py-3 pr-6 text-muted-foreground">
                        {new Date(row.createdAt).toLocaleString("ko-KR", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className={homeCardHeader}>
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                오늘 픽업 예정
              </CardTitle>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" asChild>
              <Link to={ROUTES.STORE_DETAIL_CALENDAR(storeId)}>캘린더 보기</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">불러오는 중…</p>
            ) : isError ? (
              <p className="text-sm text-destructive">불러오지 못했습니다.</p>
            ) : todayPickups.length === 0 ? (
              <p className="text-sm text-muted-foreground">오늘 픽업 예정인 주문이 없습니다.</p>
            ) : (
              todayPickups.map((o) => (
                <div
                  key={o.id}
                  className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm"
                >
                  <p className="font-mono text-xs text-foreground">{o.orderNumber}</p>
                  <p className="text-muted-foreground">
                    {o.productName} · {getOrderStatusLabel(o.orderStatus)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(o.pickupDate).toLocaleString("ko-KR")}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className={homeCardHeader}>
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4 shrink-0 text-primary" />
                최근 알림
              </CardTitle>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" asChild>
              <Link to={ROUTES.STORE_DETAIL_NOTIFICATIONS_LIST(storeId)}>알림 보기</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">불러오는 중…</p>
            ) : isError ? (
              <p className="text-sm text-destructive">불러오지 못했습니다.</p>
            ) : recentNotifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">알림이 없습니다.</p>
            ) : (
              recentNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-lg border px-3 py-2.5 text-sm ${
                    !n.read ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-foreground">{n.title}</p>
                    {!n.read ? (
                      <span className="shrink-0 rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        N
                      </span>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString("ko-KR")}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className={homeCardHeader}>
            <div className="min-w-0">
              <CardTitle className="text-base">최근 피드</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" asChild>
              <Link to={ROUTES.STORE_DETAIL_FEED_LIST(storeId)}>피드 보기</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">불러오는 중…</p>
            ) : isError ? (
              <p className="text-sm text-destructive">불러오지 못했습니다.</p>
            ) : recentFeeds.length === 0 ? (
              <p className="text-sm text-muted-foreground">등록된 피드가 없습니다.</p>
            ) : (
              recentFeeds.map((f) => (
                <div key={f.id} className="rounded-lg border border-border bg-muted/20 px-3 py-2.5">
                  <p className="font-medium text-foreground">{f.title}</p>
                  <p className="text-sm text-muted-foreground">{feedContentToExcerpt(f.content)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(f.updatedAt).toLocaleString("ko-KR")}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <StoreHomeStatisticsSection storeId={storeId} />
    </div>
  );
};
