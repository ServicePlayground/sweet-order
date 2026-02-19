import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  GetUserOrdersRequestDto,
  UserOrderListResponseDto,
} from "@apps/backend/modules/order/dto/order-user-list.dto";
import { OrderType } from "@apps/backend/modules/order/constants/order.constants";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { OrderMapperUtil } from "@apps/backend/modules/order/utils/order-mapper.util";
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
   * 픽업 예정/지난 예약을 구분하여 조회할 수 있습니다.
   */
  async getUserOrdersForUser(
    query: GetUserOrdersRequestDto,
    userId: string,
  ): Promise<UserOrderListResponseDto> {
    const { page, limit, sortBy, type } = query;

    // WHERE 조건 구성
    const where: Prisma.OrderWhereInput = {
      userId,
    };

    // 픽업 예정/지난 예약 필터
    if (type) {
      const now = new Date();
      if (type === OrderType.UPCOMING) {
        // 픽업 예정: Order의 pickupDate가 현재 시간보다 미래인 주문
        where.pickupDate = {
          gte: now,
        };
      } else if (type === OrderType.PAST) {
        // 지난 예약: Order의 pickupDate가 현재 시간보다 과거인 주문
        where.pickupDate = {
          lt: now,
        };
      }
    }

    // 전체 개수 조회
    const totalItems = await this.prisma.order.count({ where });

    // 정렬 조건 구성
    let orderBy: Prisma.OrderOrderByWithRelationInput[] = [];
    switch (sortBy) {
      case "LATEST":
        orderBy = [{ createdAt: "desc" }];
        break;
      case "OLDEST":
        orderBy = [{ createdAt: "asc" }];
        break;
      case "PRICE_DESC":
        orderBy = [{ totalPrice: "desc" }, { createdAt: "desc" }];
        break;
      case "PRICE_ASC":
        orderBy = [{ totalPrice: "asc" }, { createdAt: "desc" }];
        break;
      default:
        orderBy = [{ createdAt: "desc" }];
        break;
    }

    // 페이지네이션
    const skip = (page - 1) * limit;

    // 주문 조회 (orderItems, product 포함)
    const orders = await this.prisma.order.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: OrderMapperUtil.ORDER_ITEMS_INCLUDE,
    });

    // DTO로 변환
    const data: OrderResponseDto[] = orders.map((order) => {
      return OrderMapperUtil.mapToOrderResponse(order);
    });

    const meta = calculatePaginationMeta(page, limit, totalItems);

    return { data, meta };
  }
}
