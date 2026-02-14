import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { GetReviewsRequestDto } from "@apps/backend/modules/review/dto/review-list.dto";
import { ReviewSortBy } from "@apps/backend/modules/review/constants/review.constants";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";
import { PRODUCT_ERROR_MESSAGES } from "@apps/backend/modules/product/constants/product.constants";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";
import { ReviewMapperUtil } from "@apps/backend/modules/review/utils/review-mapper.util";

/**
 * 후기 목록 조회 서비스
 * 상품 및 스토어 후기 목록 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class ReviewListService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 상품 후기 목록 조회 (사용자용)
   * 필터링, 정렬, 페이지네이션을 지원합니다.
   */
  async getProductReviewsForUser(productId: string, query: GetReviewsRequestDto) {
    const { page, limit, sortBy } = query;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    const where: Prisma.ProductReviewWhereInput = {
      productId,
    };

    const orderBy = this.getOrderBy(sortBy);

    const totalItems = await this.prisma.productReview.count({ where });

    const skip = (page - 1) * limit;

    const reviews = await this.prisma.productReview.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: {
          select: ReviewMapperUtil.USER_INFO_SELECT,
        },
      },
    });

    const data = reviews.map((review) => ReviewMapperUtil.mapToReviewResponse(review));

    const meta = calculatePaginationMeta(page, limit, totalItems);

    return { data, meta };
  }

  /**
   * 스토어 후기 목록 조회 (사용자용)
   * 해당 스토어의 모든 상품에 대한 후기를 합쳐서 보여줍니다.
   * 필터링, 정렬, 페이지네이션을 지원합니다.
   */
  async getStoreReviewsForUser(storeId: string, query: GetReviewsRequestDto) {
    const { page, limit, sortBy } = query;

    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    const where: Prisma.ProductReviewWhereInput = {
      product: {
        storeId,
      },
    };

    const orderBy = this.getOrderBy(sortBy);

    const totalItems = await this.prisma.productReview.count({ where });

    const skip = (page - 1) * limit;

    const reviews = await this.prisma.productReview.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: {
          select: ReviewMapperUtil.USER_INFO_SELECT,
        },
      },
    });

    const data = reviews.map((review) => ReviewMapperUtil.mapToReviewResponse(review));

    const meta = calculatePaginationMeta(page, limit, totalItems);

    return { data, meta };
  }

  /**
   * 정렬 조건 반환
   */
  private getOrderBy(sortBy: ReviewSortBy): Prisma.ProductReviewOrderByWithRelationInput[] {
    switch (sortBy) {
      case ReviewSortBy.RATING_DESC:
        return [{ rating: "desc" }, { createdAt: "desc" }];
      case ReviewSortBy.RATING_ASC:
        return [{ rating: "asc" }, { createdAt: "desc" }];
      case ReviewSortBy.LATEST:
      default:
        return [{ createdAt: "desc" }];
    }
  }
}
