import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { GetReviewsRequestDto } from "@apps/backend/modules/review/dto/review-request.dto";
import {
  ReviewSortBy,
  REVIEW_ERROR_MESSAGES,
} from "@apps/backend/modules/review/constants/review.constants";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";
import { PRODUCT_ERROR_MESSAGES } from "@apps/backend/modules/product/constants/product.constants";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";

/**
 * 후기 데이터 서비스
 * 상품 후기 및 스토어 후기 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class ReviewDataService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 상품 후기 목록 조회 (필터링, 정렬, 무한스크롤 지원)
   */
  async getProductReviews(productId: string, query: GetReviewsRequestDto) {
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
    const orderBy = this.getOrderBy(sortBy);

    // 전체 개수 조회
    const totalItems = await this.prisma.productReview.count({ where });

    // 무한스크롤 계산
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

    // 무한스크롤 메타 정보
    const meta = calculatePaginationMeta(page, limit, totalItems);

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
      throw new NotFoundException(REVIEW_ERROR_MESSAGES.REVIEW_NOT_FOUND);
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

  /**
   * 스토어 후기 목록 조회 (필터링, 정렬, 무한스크롤 지원)
   * 해당 스토어의 모든 상품에 대한 후기를 합쳐서 보여줍니다.
   */
  async getStoreReviews(storeId: string, query: GetReviewsRequestDto) {
    const { page, limit, sortBy } = query;

    // 스토어 존재 여부 확인
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    // 해당 스토어의 모든 상품 ID 조회
    const products = await this.prisma.product.findMany({
      where: { storeId },
      select: { id: true },
    });

    const productIds = products.map((product) => product.id);

    // 해당 스토어에 상품이 없으면 빈 결과 반환
    if (productIds.length === 0) {
      return {
        data: [],
        meta: calculatePaginationMeta(page, limit, 0),
      };
    }

    // 필터 조건 구성 - 해당 스토어의 모든 상품에 대한 후기
    const where: Prisma.ProductReviewWhereInput = {
      productId: {
        in: productIds,
      },
    };

    // 정렬 조건 구성
    const orderBy = this.getOrderBy(sortBy);

    // 전체 개수 조회
    const totalItems = await this.prisma.productReview.count({ where });

    // 무한스크롤 계산
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

    // 무한스크롤 메타 정보
    const meta = calculatePaginationMeta(page, limit, totalItems);

    return { data, meta };
  }

  /**
   * 스토어 후기 단일 조회
   * 해당 스토어의 상품 중 하나에 대한 후기를 조회합니다.
   */
  async getStoreReview(storeId: string, reviewId: string) {
    // 스토어 존재 여부 확인
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    // 해당 스토어의 모든 상품 ID 조회
    const products = await this.prisma.product.findMany({
      where: { storeId },
      select: { id: true },
    });

    const productIds = products.map((product) => product.id);

    // 후기 조회 (해당 스토어의 상품 중 하나에 대한 후기인지 확인)
    const review = await this.prisma.productReview.findFirst({
      where: {
        id: reviewId,
        productId: {
          in: productIds,
        },
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
      throw new NotFoundException(REVIEW_ERROR_MESSAGES.REVIEW_NOT_FOUND);
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
