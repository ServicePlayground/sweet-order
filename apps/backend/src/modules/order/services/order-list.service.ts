import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { GetSellerOrdersRequestDto } from "@apps/backend/modules/order/dto/order-request.dto";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { OrderMapperUtil } from "@apps/backend/modules/order/utils/order-mapper.util";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  OrderListResponseDto,
  OrderResponseDto,
} from "@apps/backend/modules/order/dto/order-response.dto";

/**
 * 주문 목록 조회 서비스
 * 판매자용 주문 목록 조회 관련 로직을 담당합니다.
 */
@Injectable()
export class OrderListService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 판매자용 주문 목록 조회 (필터링, 정렬, 페이지네이션 지원)
   * 자신이 소유한 스토어의 주문만 조회합니다.
   */
  async getSellerOrders(
    query: GetSellerOrdersRequestDto,
    user: JwtVerifiedPayload,
  ): Promise<OrderListResponseDto> {
    const { page, limit, sortBy, storeId, orderStatus, startDate, endDate, orderNumber } = query;

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
        throw new Error("해당 스토어에 대한 권한이 없습니다.");
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

    // 주문 조회 (orderItems, product, user 포함)
    const orders = await this.prisma.order.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        orderItems: true,
        product: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            nickname: true,
          },
        },
      },
    });

    // DTO로 변환
    const data: OrderResponseDto[] = orders.map((order) => {
      const orderResponse = OrderMapperUtil.mapToOrderResponse(order);

      // 추가 정보 포함 (product, user 정보는 별도로 관리하지 않지만 필요시 확장 가능)
      return orderResponse;
    });

    const meta = calculatePaginationMeta(page, limit, totalItems);

    return { data, meta };
  }
}
