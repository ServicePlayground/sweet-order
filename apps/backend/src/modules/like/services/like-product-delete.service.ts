import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { LIKE_ERROR_MESSAGES } from "@apps/backend/modules/like/constants/like.constants";

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
    // 좋아요 존재 여부 확인
    const existingLike = await this.prisma.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!existingLike) {
      throw new NotFoundException(LIKE_ERROR_MESSAGES.PRODUCT_LIKE_NOT_FOUND);
    }

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

      // 상품의 likeCount 감소 (0 이하로 내려가지 않도록 처리)
      await tx.product.update({
        where: { id: productId },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });
    });
  }
}
