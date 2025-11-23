import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { PRODUCT_ERROR_MESSAGES } from "@apps/backend/modules/product/constants/product.constants";

/**
 * 상품 좋아요 서비스
 * 상품 좋아요 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class ProductLikeService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 상품 좋아요 추가
   * @param userId 사용자 ID
   * @param productId 상품 ID
   */
  async addProductLike(userId: string, productId: string) {
    // 상품 존재 여부 확인
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    // 이미 좋아요한 상품인지 확인
    const existingLike = await this.prisma.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingLike) {
      throw new ConflictException(PRODUCT_ERROR_MESSAGES.LIKE_ALREADY_EXISTS);
    }

    // 좋아요 추가 및 상품의 likeCount 증가 - 트랜잭션으로 일관성 보장
    await this.prisma.$transaction(async (tx) => {
      // 좋아요 추가
      await tx.productLike.create({
        data: {
          userId,
          productId,
        },
      });

      // 상품의 likeCount 증가
      await tx.product.update({
        where: { id: productId },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });
    });
  }

  /**
   * 상품 좋아요 삭제
   * @param userId 사용자 ID
   * @param productId 상품 ID
   */
  async removeProductLike(userId: string, productId: string) {
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
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.LIKE_NOT_FOUND);
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

  /**
   * 상품 좋아요 여부 확인
   * @param userId 사용자 ID
   * @param productId 상품 ID
   * @returns 좋아요 여부
   */
  async isLiked(userId: string, productId: string): Promise<boolean> {
    // 상품 존재 여부 확인
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
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
