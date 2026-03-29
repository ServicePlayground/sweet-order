import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { OrderSortBy, OrderType } from "@apps/backend/modules/order/constants/order.constants";

const KOREA_OFFSET = "+09:00";

/** YYYY-MM-DD (Asia/Seoul 달력일) → 해당 일 00:00:00.000 KST 의 UTC 시각 */
export function koreaCalendarDayStartUtc(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000${KOREA_OFFSET}`);
}

/** YYYY-MM-DD (Asia/Seoul 달력일) → 해당 일 23:59:59.999 KST 의 UTC 시각 */
export function koreaCalendarDayEndUtc(dateStr: string): Date {
  return new Date(`${dateStr}T23:59:59.999${KOREA_OFFSET}`);
}

/**
 * `type`(UPCOMING/PAST) 및 픽업일 달력 구간 필터를 `where`에 반영.
 * 둘 다 있으면 AND로 결합해 `pickupDate` 조건이 덮어쓰이지 않게 함.
 */
export function mergeOrderPickupDateConditions(
  where: Prisma.OrderWhereInput,
  opts: {
    type?: OrderType;
    pickupStartDate?: string;
    pickupEndDate?: string;
  },
): void {
  const { type, pickupStartDate, pickupEndDate } = opts;
  const parts: Prisma.OrderWhereInput[] = [];

  if (type === OrderType.UPCOMING) {
    parts.push({ pickupDate: { gte: new Date() } });
  } else if (type === OrderType.PAST) {
    parts.push({ pickupDate: { lt: new Date() } });
  }

  if (pickupStartDate || pickupEndDate) {
    const range: Prisma.DateTimeNullableFilter = {};
    if (pickupStartDate) {
      range.gte = koreaCalendarDayStartUtc(pickupStartDate);
    }
    if (pickupEndDate) {
      range.lte = koreaCalendarDayEndUtc(pickupEndDate);
    }
    parts.push({ pickupDate: range });
  }

  if (parts.length === 0) {
    return;
  }

  if (parts.length === 1) {
    const only = parts[0]!.pickupDate;
    if (only !== undefined) {
      where.pickupDate = only;
    }
    return;
  }

  const existing = where.AND;
  const prefix = Array.isArray(existing) ? existing : existing ? [existing] : [];
  where.AND = [...prefix, ...parts];
}

/**
 * 주문 목록 조회 시 공통으로 사용하는 정렬 조건
 * 사용자 마이페이지 주문 목록 / 판매자 주문 목록에서 동일한 정렬 규칙 적용
 */
export function buildOrderOrderBy(sortBy: OrderSortBy): Prisma.OrderOrderByWithRelationInput[] {
  switch (sortBy) {
    case OrderSortBy.LATEST:
      return [{ createdAt: "desc" }];
    case OrderSortBy.OLDEST:
      return [{ createdAt: "asc" }];
    case OrderSortBy.PRICE_DESC:
      return [{ totalPrice: "desc" }, { createdAt: "desc" }];
    case OrderSortBy.PRICE_ASC:
      return [{ totalPrice: "asc" }, { createdAt: "desc" }];
    default:
      return [{ createdAt: "desc" }];
  }
}
