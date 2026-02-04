import { Store } from "@apps/backend/infra/database/prisma/generated/client";
import { StoreInfo } from "@apps/backend/modules/store/types/store.types";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";

/**
 * 스토어 매핑 유틸리티
 * Prisma Store 엔티티를 응답 DTO로 변환하는 공통 로직을 제공합니다.
 */
export class StoreMapperUtil {
  /**
   * Prisma Store 엔티티를 StoreInfo 인터페이스로 변환
   * @param store - Prisma Store 엔티티
   * @param prisma - PrismaService 인스턴스 (후기 통계 계산용)
   * @returns StoreInfo 객체
   */
  static async mapToStoreResponse(store: Store, prisma: PrismaService): Promise<StoreInfo> {
    // 해당 스토어의 모든 상품 ID 조회
    const products = await prisma.product.findMany({
      where: { storeId: store.id },
      select: { id: true },
    });

    const productIds = products.map((product) => product.id);

    // 후기 통계 계산
    let averageRating = 0;
    let totalReviewCount = 0;

    if (productIds.length > 0) {
      // 해당 스토어의 모든 상품에 대한 후기 조회
      const reviews = await prisma.productReview.findMany({
        where: {
          productId: {
            in: productIds,
          },
        },
        select: {
          rating: true,
        },
      });

      totalReviewCount = reviews.length;

      if (totalReviewCount > 0) {
        // 평균 별점 계산
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = Math.round((totalRating / totalReviewCount) * 10) / 10; // 소수점 첫째자리까지
      }
    }

    return {
      id: store.id,
      userId: store.userId,
      logoImageUrl: store.logoImageUrl ?? undefined,
      name: store.name,
      description: store.description ?? undefined,
      businessNo: store.businessNo,
      representativeName: store.representativeName,
      openingDate: store.openingDate,
      businessName: store.businessName,
      businessSector: store.businessSector,
      businessType: store.businessType,
      permissionManagementNumber: store.permissionManagementNumber,
      address: store.address,
      roadAddress: store.roadAddress,
      zonecode: store.zonecode,
      latitude: store.latitude,
      longitude: store.longitude,
      likeCount: store.likeCount,
      averageRating,
      totalReviewCount,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
    };
  }
}
