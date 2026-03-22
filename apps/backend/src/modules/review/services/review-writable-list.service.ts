import { Injectable } from "@nestjs/common";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { OrderStatus } from "@apps/backend/modules/order/constants/order.constants";
import { OrderMapperUtil } from "@apps/backend/modules/order/utils/order-mapper.util";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";
import { GetWritableReviewOrdersRequestDto } from "@apps/backend/modules/review/dto/review-writable-list.dto";

/**
 * 작성 가능한 후기 대상 주문 목록 (마이페이지)
 *
 * 조건: 본인 주문, 픽업 완료, 주문에 연결된 `ProductReview`가 없을 때만 포함
 * (삭제 시 `order_id`를 유지한 톰스톤 행이 남으므로 관계가 존재해 목록에서 제외됨)
 */
@Injectable()
export class ReviewWritableListService {
  constructor(private readonly prisma: PrismaService) {}

  async getWritableOrdersForUser(userId: string, query: GetWritableReviewOrdersRequestDto) {
    const { page, limit } = query;

    const where: Prisma.OrderWhereInput = {
      userId,
      orderStatus: OrderStatus.PICKUP_COMPLETED,
      review: { is: null },
    };

    const totalItems = await this.prisma.order.count({ where });

    const skip = (page - 1) * limit;

    const orders = await this.prisma.order.findMany({
      where,
      orderBy: [{ pickupDate: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
      include: OrderMapperUtil.ORDER_ITEMS_INCLUDE,
    });

    const data = orders.map((order) => OrderMapperUtil.mapToOrderResponse(order));
    const meta = calculatePaginationMeta(page, limit, totalItems);

    return { data, meta };
  }
}
