import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { PRODUCT_ERROR_MESSAGES } from "@apps/backend/modules/product/constants/product.constants";
import { LIKE_ERROR_MESSAGES } from "@apps/backend/modules/like/constants/like.constants";

/**
 * 상품 좋아요 생성 서비스
 * 상품 좋아요 추가 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class LikeProductCreateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 상품 좋아요 추가 (사용자용)
   * @param userId 사용자 ID
   * @param productId 상품 ID
   */
  async addProductLikeForUser(userId: string, productId: string) {
    // 상품 존재 여부 확인
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    try {
      // 좋아요 추가 및 상품의 likeCount 증가 - 트랜잭션으로 일관성 보장
      await this.prisma.$transaction(async (tx) => {
        // 좋아요 추가 (중복 생성은 DB unique 제약으로 방지)
        await tx.productLike.create({
          data: {
            userId,
            productId,
          },
        });

        // 상품의 likeCount 증가 (원자적 연산)
        await tx.product.update({
          where: { id: productId },
          data: {
            likeCount: {
              increment: 1,
            },
          },
        });
      });
    } catch (error: any) {
      if (error?.code === "P2002") {
        throw new ConflictException(LIKE_ERROR_MESSAGES.PRODUCT_LIKE_ALREADY_EXISTS);
      }
      if (error?.code === "P2025") {
        throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
      }
      throw error;
    }
  }
}
