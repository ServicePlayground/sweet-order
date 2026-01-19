import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { GetProductReviewsRequestDto } from "@apps/backend/modules/product/dto/product-review-request.dto";
import {
  ReviewSortBy,
  PRODUCT_ERROR_MESSAGES,
} from "@apps/backend/modules/product/constants/product.constants";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";

/**
 * 상품 후기 서비스
 * 상품 후기 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class ProductReviewService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 상품 후기 목록 조회 (필터링, 정렬, 무한스크롤 지원)
   */
  async getProductReviews(productId: string, query: GetProductReviewsRequestDto) {
    const { page, limit, sortBy } = query;

    // 상품 존재 여부 확인
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    // 필터 조건 구성
    const where: Prisma.ProductReviewWhereInput = {
      productId,
    };

    // 정렬 조건 구성
    let orderBy: Prisma.ProductReviewOrderByWithRelationInput[] = [];

    switch (sortBy) {
      case ReviewSortBy.RATING_DESC:
        orderBy = [{ rating: "desc" }, { createdAt: "desc" }];
        break;
      case ReviewSortBy.RATING_ASC:
        orderBy = [{ rating: "asc" }, { createdAt: "desc" }];
        break;
      case ReviewSortBy.LATEST:
      default:
        orderBy = [{ createdAt: "desc" }];
        break;
    }

    // 전체 개수 조회
    const totalItems = await this.prisma.productReview.count({ where });

    // 무한스크롤 계산
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;

    // 후기 목록 조회 (사용자 정보 포함)
    const reviews = await this.prisma.productReview.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            nickname: true,
            profileImageUrl: true,
          },
        },
      },
    });

    // 응답 데이터 변환
    const data = reviews.map((review) => ({
      id: review.id,
      productId: review.productId,
      userId: review.userId,
      rating: review.rating,
      content: review.content,
      imageUrls: review.imageUrls,
      userNickname: review.user.nickname,
      userProfileImageUrl: review.user.profileImageUrl,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));

    // 무한스크롤 메타 정보 계산
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // 무한스크롤 메타 정보
    const meta = {
      currentPage: page,
      limit,
      totalItems,
      totalPages,
      hasNext,
      hasPrev,
    };

    return { data, meta };
  }

  /**
   * 상품 후기 단일 조회
   */
  async getProductReview(productId: string, reviewId: string) {
    // 상품 존재 여부 확인
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    // 후기 조회 (사용자 정보 포함)
    const review = await this.prisma.productReview.findFirst({
      where: {
        id: reviewId,
        productId,
      },
      include: {
        user: {
          select: {
            nickname: true,
            profileImageUrl: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.REVIEW_NOT_FOUND);
    }

    // 응답 데이터 변환
    return {
      id: review.id,
      productId: review.productId,
      userId: review.userId,
      rating: review.rating,
      content: review.content,
      imageUrls: review.imageUrls,
      userNickname: review.user.nickname,
      userProfileImageUrl: review.user.profileImageUrl,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }
}

