import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/apps/web-seller/common/components/selects/Select";
import { BaseInput as Input } from "@/apps/web-seller/common/components/inputs/BaseInput";
import { BaseButton as Button } from "@/apps/web-seller/common/components/buttons/BaseButton";
import { Label } from "@/apps/web-seller/common/components/labels/Label";
import { useOrderList } from "@/apps/web-seller/features/order/hooks/queries/useOrderQuery";
import { OrderList } from "@/apps/web-seller/features/order/components/list/OrderList";
import {
  OrderSortBy,
  OrderStatus,
  OrderType,
} from "@/apps/web-seller/features/order/types/order.dto";
import { useDebouncedValue } from "@/apps/web-seller/common/hooks/useDebouncedValue";

const DEBOUNCE_DELAY_MS = 300;
const LIMIT = 30;

export const StoreDetailOrderListPage: React.FC = () => {
  const { storeId } = useParams();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<OrderSortBy>(OrderSortBy.LATEST);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | undefined>(undefined);
  const [type, setType] = useState<OrderType | undefined>(undefined);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // 주문 번호 검색 debounce (과도한 API 호출 방지)
  const debouncedOrderNumber = useDebouncedValue(orderNumber, DEBOUNCE_DELAY_MS);

  // 필터나 정렬이 변경되면 페이지를 1로 리셋
  useEffect(() => {
    setPage(1);
  }, [orderStatus, type, debouncedOrderNumber, startDate, endDate, sortBy]);

  const handleResetFilters = useCallback(() => {
    setPage(1);
    setOrderStatus(undefined);
    setType(undefined);
    setOrderNumber("");
    setStartDate("");
    setEndDate("");
  }, []);

  const hasActiveFilters =
    orderStatus !== undefined ||
    type !== undefined ||
    orderNumber.trim() !== "" ||
    startDate !== "" ||
    endDate !== "";

  if (!storeId) {
    return (
      <div>
        <h2 className="text-xl font-semibold">스토어가 선택되지 않았습니다.</h2>
      </div>
    );
  }

  const { data, isLoading, isError } = useOrderList({
    page,
    limit: LIMIT,
    sortBy,
    storeId,
    orderStatus,
    type,
    orderNumber: debouncedOrderNumber.trim() || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const orders = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">주문 목록</h1>
      </div>

      {/* 필터 및 정렬 */}
      <div className="space-y-4 rounded-lg border bg-card p-4">
        {/* 통계 및 정렬 */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              총 <span className="font-semibold text-foreground">{meta?.totalItems || 0}</span>개의
              주문
            </div>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                필터 초기화
              </Button>
            )}
          </div>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as OrderSortBy)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="정렬 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={OrderSortBy.LATEST}>최신순</SelectItem>
              <SelectItem value={OrderSortBy.OLDEST}>오래된순</SelectItem>
              <SelectItem value={OrderSortBy.PRICE_DESC}>금액 높은순</SelectItem>
              <SelectItem value={OrderSortBy.PRICE_ASC}>금액 낮은순</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 필터 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* 주문 번호 검색 */}
          <div className="space-y-2">
            <Label>주문 번호</Label>
            <Input
              placeholder="주문 번호 검색"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </div>

          {/* 주문 상태 필터 */}
          <div className="space-y-2">
            <Label>주문 상태</Label>
            <Select
              value={orderStatus || "ALL"}
              onValueChange={(value) =>
                setOrderStatus(value === "ALL" ? undefined : (value as OrderStatus))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체</SelectItem>
                <SelectItem value={OrderStatus.PENDING}>대기중</SelectItem>
                <SelectItem value={OrderStatus.CONFIRMED}>확정됨</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 픽업 예정/지난 예약 */}
          <div className="space-y-2">
            <Label>픽업 예정/지난 예약</Label>
            <Select
              value={type ?? "ALL"}
              onValueChange={(value) => setType(value === "ALL" ? undefined : (value as OrderType))}
            >
              <SelectTrigger>
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체</SelectItem>
                <SelectItem value={OrderType.UPCOMING}>픽업 예정</SelectItem>
                <SelectItem value={OrderType.PAST}>지난 예약</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 시작 날짜 */}
          <div className="space-y-2">
            <Label>시작 날짜</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          {/* 종료 날짜 */}
          <div className="space-y-2">
            <Label>종료 날짜</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      </div>

      {/* 주문 목록 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">주문을 불러오는 중...</div>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-destructive">주문을 불러오는 중 오류가 발생했습니다.</div>
        </div>
      ) : (
        <>
          <OrderList orders={orders} />

          {/* 페이지네이션 */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                이전
              </Button>
              <div className="text-sm text-muted-foreground">
                {page} / {meta.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
              >
                다음
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
