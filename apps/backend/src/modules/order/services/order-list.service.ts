import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  OrderListResponseDto,
  OrderListRequestDto,
} from "@apps/backend/modules/order/dto/order-list.dto";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { OrderMapperUtil } from "@apps/backend/modules/order/utils/order-mapper.util";
import { buildOrderOrderBy } from "@apps/backend/modules/order/utils/order-list-query.util";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { OrderResponseDto } from "@apps/backend/modules/order/dto/order-detail.dto";
import {
  ORDER_ERROR_MESSAGES,
  OrderType,
} from "@apps/backend/modules/order/constants/order.constants";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 주문 목록 조회 서비스
 * 판매자용 주문 목록 조회 관련 로직을 담당합니다.
 */
@Injectable()
export class OrderListService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 판매자용 주문 목록 조회 (판매자용)
   * 자신이 소유한 스토어의 주문만 조회합니다.
   */
  async getOrdersForSeller(
    query: OrderListRequestDto,
    user: JwtVerifiedPayload,
  ): Promise<OrderListResponseDto> {
    const { page, limit, sortBy, storeId, orderStatus, startDate, endDate, orderNumber, type } =
      query;

    // 사용자가 소유한 스토어 목록 조회
    const userStores = await this.prisma.store.findMany({
      where: {
        userId: user.sub,
      },
      select: {
        id: true,
      },
    });

    const userStoreIds = userStores.map((store) => store.id);

    if (userStoreIds.length === 0) {
      return {
        data: [],
        meta: calculatePaginationMeta(page, limit, 0),
      };
    }

    // WHERE 조건 구성
    const where: Prisma.OrderWhereInput = {
      storeId: {
        in: userStoreIds,
      },
    };

    // 스토어 필터
    if (storeId) {
      if (!userStoreIds.includes(storeId)) {
        LoggerUtil.log(
          `주문 목록 조회 실패: 스토어 소유권 없음 - userId: ${user.sub}, storeId: ${storeId}`,
        );
        throw new ForbiddenException(ORDER_ERROR_MESSAGES.STORE_NOT_OWNED);
      }
      where.storeId = storeId;
    }

    // 주문 상태 필터
    if (orderStatus) {
      where.orderStatus = orderStatus;
    }

    // 날짜 필터
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // endDate의 하루 끝까지 포함하도록 설정
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDateTime;
      }
    }

    // 주문 번호 검색
    if (orderNumber) {
      where.orderNumber = {
        contains: orderNumber,
      };
    }

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

    const totalItems = await this.prisma.order.count({ where });
    const orderBy = buildOrderOrderBy(sortBy);

    // 페이지네이션
    const skip = (page - 1) * limit;

    // 주문 조회
    const orders = await this.prisma.order.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: OrderMapperUtil.ORDER_ITEMS_INCLUDE,
    });

    // DTO로 변환
    const data: OrderResponseDto[] = orders.map((order) =>
      OrderMapperUtil.mapToOrderResponse(order),
    );

    const meta = calculatePaginationMeta(page, limit, totalItems);

    return { data, meta };
  }
}
