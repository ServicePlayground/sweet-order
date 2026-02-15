import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { LIKE_ERROR_MESSAGES } from "@apps/backend/modules/like/constants/like.constants";
import { PRODUCT_ERROR_MESSAGES } from "@apps/backend/modules/product/constants/product.constants";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 상품 좋아요 삭제 서비스
 * 상품 좋아요 삭제 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class LikeProductDeleteService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 상품 좋아요 삭제 (사용자용)
   * @param userId 사용자 ID
   * @param productId 상품 ID
   */
  async removeProductLikeForUser(userId: string, productId: string) {
    // 상품 존재 여부 확인
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      LoggerUtil.log(
        `상품 좋아요 삭제 실패: 상품을 찾을 수 없음 - userId: ${userId}, productId: ${productId}`,
      );
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    try {
      // 좋아요 삭제 및 상품의 likeCount 감소 - 트랜잭션으로 일관성 보장
      await this.prisma.$transaction(
        async (tx) => {
          // 좋아요 삭제
          await tx.productLike.delete({
            where: {
              userId_productId: {
                userId,
                productId,
              },
            },
          });

          // 상품의 likeCount 감소 (원자적 연산, 음수 방지를 위해 조건부 업데이트)
          await tx.product.updateMany({
            where: {
              id: productId,
              likeCount: { gt: 0 },
            },
            data: {
              likeCount: {
                decrement: 1,
              },
            },
          });
        },
        {
          maxWait: 5000, // 최대 대기 시간 (5초)
          timeout: 10000, // 타임아웃 (10초)
        },
      );
    } catch (error: any) {
      if (error?.code === "P2025") {
        LoggerUtil.log(
          `상품 좋아요 삭제 실패: 좋아요를 찾을 수 없음 - userId: ${userId}, productId: ${productId}`,
        );
        throw new NotFoundException(LIKE_ERROR_MESSAGES.PRODUCT_LIKE_NOT_FOUND);
      }
      LoggerUtil.log(
        `상품 좋아요 삭제 실패: 트랜잭션 에러 - userId: ${userId}, productId: ${productId}, error: ${error?.message || String(error)}`,
      );
      throw error;
    }
  }
}
