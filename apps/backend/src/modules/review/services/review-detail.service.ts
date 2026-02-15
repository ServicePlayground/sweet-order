import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { REVIEW_ERROR_MESSAGES } from "@apps/backend/modules/review/constants/review.constants";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";
import { PRODUCT_ERROR_MESSAGES } from "@apps/backend/modules/product/constants/product.constants";
import { ReviewMapperUtil } from "@apps/backend/modules/review/utils/review-mapper.util";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 후기 단일 조회 서비스
 * 상품 및 스토어 후기 단건 조회 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class ReviewDetailService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 상품 후기 단일 조회 (사용자용)
   */
  async getProductReviewForUser(productId: string, reviewId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      LoggerUtil.log(
        `후기 상세 조회 실패: 상품 없음 - productId: ${productId}, reviewId: ${reviewId}`,
      );
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    const review = await this.prisma.productReview.findFirst({
      where: {
        id: reviewId,
        productId,
      },
      include: {
        user: {
          select: ReviewMapperUtil.USER_INFO_SELECT,
        },
      },
    });

    if (!review) {
      LoggerUtil.log(
        `후기 상세 조회 실패: 후기 없음 - productId: ${productId}, reviewId: ${reviewId}`,
      );
      throw new NotFoundException(REVIEW_ERROR_MESSAGES.REVIEW_NOT_FOUND);
    }

    return ReviewMapperUtil.mapToReviewResponse(review);
  }

  /**
   * 스토어 후기 단일 조회 (사용자용)
   * 해당 스토어의 상품 중 하나에 대한 후기를 조회합니다.
   */
  async getStoreReviewForUser(storeId: string, reviewId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });

    if (!store) {
      LoggerUtil.log(
        `후기 상세 조회 실패: 스토어 없음 - storeId: ${storeId}, reviewId: ${reviewId}`,
      );
      throw new NotFoundException(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    const review = await this.prisma.productReview.findFirst({
      where: {
        id: reviewId,
        product: {
          storeId,
        },
      },
      include: {
        user: {
          select: ReviewMapperUtil.USER_INFO_SELECT,
        },
      },
    });

    if (!review) {
      LoggerUtil.log(`후기 상세 조회 실패: 후기 없음 - storeId: ${storeId}, reviewId: ${reviewId}`);
      throw new NotFoundException(REVIEW_ERROR_MESSAGES.REVIEW_NOT_FOUND);
    }

    return ReviewMapperUtil.mapToReviewResponse(review);
  }
}
