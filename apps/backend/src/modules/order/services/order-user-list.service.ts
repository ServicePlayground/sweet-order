import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  OrderListResponseDto,
  OrderListRequestDto,
} from "@apps/backend/modules/order/dto/order-list.dto";
import { OrderType } from "@apps/backend/modules/order/constants/order.constants";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { OrderMapperUtil } from "@apps/backend/modules/order/utils/order-mapper.util";
import { buildOrderOrderBy } from "@apps/backend/modules/order/utils/order-list-query.util";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";
import { OrderResponseDto } from "@apps/backend/modules/order/dto/order-detail.dto";

/**
 * 사용자용 주문 목록 조회 서비스
 * 사용자용 주문 목록 조회 관련 로직을 담당합니다.
 */
@Injectable()
export class OrderUserListService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 사용자용 주문 목록 조회 (사용자용)
   * 자신의 주문만 조회합니다.
   */
  async getUserOrdersForUser(
    query: OrderListRequestDto,
    userId: string,
  ): Promise<OrderListResponseDto> {
    const { page, limit, sortBy, type, storeId, orderStatus, startDate, endDate, orderNumber } =
      query;

    const where: Prisma.OrderWhereInput = {
      userId,
    };

    // 픽업 예정/지난 예약 필터 (픽업 일시와 현재 시각 비교)
    if (type) {
      const now = new Date();
      if (type === OrderType.UPCOMING) {
        // 픽업 예정: 픽업 일시 >= 현재 → 아직 픽업 시점이 지나지 않음
        where.pickupDate = { gte: now };
      } else if (type === OrderType.PAST) {
        // 지난 예약: 픽업 일시 < 현재 → 픽업 시점이 이미 지남
        where.pickupDate = { lt: now };
      }
    }

    if (storeId) {
      where.storeId = storeId;
    }
    if (orderStatus) {
      where.orderStatus = orderStatus;
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDateTime;
      }
    }
    if (orderNumber) {
      where.orderNumber = { contains: orderNumber };
    }

    const totalItems = await this.prisma.order.count({ where });
    const orderBy = buildOrderOrderBy(sortBy);
    const skip = (page - 1) * limit;

    const orders = await this.prisma.order.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: OrderMapperUtil.ORDER_ITEMS_INCLUDE,
    });

    const data: OrderResponseDto[] = orders.map((order) =>
      OrderMapperUtil.mapToOrderResponse(order),
    );
    const meta = calculatePaginationMeta(page, limit, totalItems);

    return { data, meta };
  }
}
