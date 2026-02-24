import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { OrderSortBy } from "@apps/backend/modules/order/constants/order.constants";

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
