import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { LIKE_ERROR_MESSAGES } from "@apps/backend/modules/like/constants/like.constants";
import { PRODUCT_ERROR_MESSAGES } from "@apps/backend/modules/product/constants/product.constants";

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
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    try {
      // 좋아요 삭제 및 상품의 likeCount 감소 - 트랜잭션으로 일관성 보장
      await this.prisma.$transaction(async (tx) => {
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
      });
    } catch (error: any) {
      if (error?.code === "P2025") {
        throw new NotFoundException(LIKE_ERROR_MESSAGES.PRODUCT_LIKE_NOT_FOUND);
      }
      throw error;
    }
  }
}
