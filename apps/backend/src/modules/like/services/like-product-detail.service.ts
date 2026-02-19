import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { PRODUCT_ERROR_MESSAGES } from "@apps/backend/modules/product/constants/product.constants";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 상품 좋아요 상세 서비스
 * 상품 좋아요 여부 확인 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class LikeProductDetailService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 상품 좋아요 여부 확인
   * @param userId 사용자 ID
   * @param productId 상품 ID
   * @returns 좋아요 여부
   */
  async isProductLiked(userId: string, productId: string): Promise<boolean> {
    // 상품 존재 여부 확인
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      LoggerUtil.log(
        `상품 좋아요 여부 확인 실패: 상품 없음 - userId: ${userId}, productId: ${productId}`,
      );
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    // 좋아요 여부 확인
    const like = await this.prisma.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return !!like;
  }
}
