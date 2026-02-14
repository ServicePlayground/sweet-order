import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { PRODUCT_ERROR_MESSAGES } from "@apps/backend/modules/product/constants/product.constants";
import { Product, Prisma } from "@apps/backend/infra/database/prisma/generated/client";

/**
 * 상품 소유권 확인 유틸리티
 */
export class ProductOwnershipUtil {
  /**
   * 상품을 조회하고 스토어 소유권을 확인합니다.
   * @param prisma PrismaService 인스턴스
   * @param productId 상품 ID
   * @param userId 사용자 ID (스토어 소유자)
   * @param includeStoreSelect 스토어 조회 시 포함할 필드
   * @returns 상품 정보 (스토어 정보 포함)
   * @throws NotFoundException 상품을 찾을 수 없을 경우
   * @throws ForbiddenException 스토어 소유권이 없을 경우
   */
  static async verifyProductOwnership(
    prisma: PrismaService,
    productId: string,
    userId: string,
    includeStoreSelect?: Prisma.StoreSelect,
  ): Promise<Product & { store: { userId: string; [key: string]: any } }> {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
      include: {
        store: {
          select: {
            userId: true,
            ...(includeStoreSelect || {}),
          },
        },
      },
    });

    if (!product || !product.store) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    if (product.store.userId !== userId) {
      throw new ForbiddenException(PRODUCT_ERROR_MESSAGES.FORBIDDEN);
    }

    return product as Product & { store: { userId: string; [key: string]: any } };
  }

  /**
   * 스토어 소유권을 확인합니다.
   * @param prisma PrismaService 인스턴스
   * @param storeId 스토어 ID
   * @param userId 사용자 ID (스토어 소유자)
   * @throws NotFoundException 스토어를 찾을 수 없을 경우
   * @throws ForbiddenException 스토어 소유권이 없을 경우
   */
  static async verifyStoreOwnership(
    prisma: PrismaService,
    storeId: string,
    userId: string,
  ): Promise<void> {
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!store) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.STORE_NOT_FOUND);
    }

    if (store.userId !== userId) {
      throw new ForbiddenException(PRODUCT_ERROR_MESSAGES.STORE_NOT_OWNED);
    }
  }
}
