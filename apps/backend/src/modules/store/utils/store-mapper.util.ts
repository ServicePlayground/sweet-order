import { Store } from "@apps/backend/infra/database/prisma/generated/client";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { StoreResponseDto } from "@apps/backend/modules/store/dto/store-detail.dto";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";

/**
 * 스토어 매핑 유틸리티
 * Prisma Store 엔티티를 응답 DTO로 변환하는 공통 로직을 제공합니다.
 */
export class StoreMapperUtil {
  /**
   * Product ID와 StoreId select 필드
   * 상품 ID와 스토어 ID를 함께 조회할 때 사용
   */
  static readonly PRODUCT_ID_WITH_STORE_ID_SELECT = {
    id: true,
    storeId: true,
  } as const satisfies Prisma.ProductSelect;

  /**
   * Review rating과 productId select 필드
   * 후기 rating과 productId를 함께 조회할 때 사용
   */
  static readonly REVIEW_RATING_WITH_PRODUCT_ID_SELECT = {
    productId: true,
    rating: true,
  } as const satisfies Prisma.ProductReviewSelect;

  /**
   * Prisma Store 엔티티를 StoreResponseDto로 변환
   * 단일 스토어 또는 여러 스토어를 처리합니다. N+1 쿼리 문제를 방지하기 위해 배치로 처리합니다.
   * @param stores - Prisma Store 엔티티 또는 배열
   * @param prisma - PrismaService 인스턴스 (후기 통계 계산용)
   * @returns StoreResponseDto 또는 배열
   */
  static async mapToStoreResponse(
    stores: Store | Store[],
    prisma: PrismaService,
  ): Promise<StoreResponseDto | StoreResponseDto[]> {
    const storesArray = Array.isArray(stores) ? stores : [stores];
    const isSingle = !Array.isArray(stores);

    if (storesArray.length === 0) {
      return isSingle ? ({} as StoreResponseDto) : [];
    }

    const storeIds = storesArray.map((store) => store.id);

    // 모든 스토어의 상품들을 한 번에 조회
    const allProducts = await prisma.product.findMany({
      where: {
        storeId: {
          in: storeIds,
        },
      },
      select: StoreMapperUtil.PRODUCT_ID_WITH_STORE_ID_SELECT,
    });

    // 스토어별 상품 ID 그룹화
    const productsByStoreId = new Map<string, string[]>();
    for (const product of allProducts) {
      if (!productsByStoreId.has(product.storeId)) {
        productsByStoreId.set(product.storeId, []);
      }
      productsByStoreId.get(product.storeId)!.push(product.id);
    }

    // 모든 상품 ID 수집
    const allProductIds = allProducts.map((product) => product.id);

    // 모든 후기를 한 번에 조회
    const allReviews = await prisma.productReview.findMany({
      where: {
        productId: {
          in: allProductIds,
        },
      },
      select: StoreMapperUtil.REVIEW_RATING_WITH_PRODUCT_ID_SELECT,
    });

    // 상품별 후기 그룹화
    const reviewsByProductId = new Map<string, Array<{ rating: number }>>();
    for (const review of allReviews) {
      if (!reviewsByProductId.has(review.productId)) {
        reviewsByProductId.set(review.productId, []);
      }
      reviewsByProductId.get(review.productId)!.push({ rating: review.rating });
    }

    // 스토어별 후기 통계 계산
    const results = storesArray.map((store) => {
      const productIds = productsByStoreId.get(store.id) || [];
      const reviews: Array<{ rating: number }> = [];

      // 해당 스토어의 모든 상품에 대한 후기 수집
      for (const productId of productIds) {
        const productReviews = reviewsByProductId.get(productId) || [];
        reviews.push(...productReviews);
      }

      const totalReviewCount = reviews.length;
      let averageRating = 0;

      if (totalReviewCount > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = Math.round((totalRating / totalReviewCount) * 10) / 10; // 소수점 첫째자리까지
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
    });

    return isSingle ? results[0] : results;
  }
}
