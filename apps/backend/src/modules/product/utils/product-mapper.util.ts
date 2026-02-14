import { ProductResponseDto } from "@apps/backend/modules/product/dto/product-detail.dto";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";

/**
 * 상품 매핑 유틸리티
 * 상품 응답 DTO 변환 시 공통 로직을 제공합니다.
 */

/**
 * Store만 include된 Product 타입
 * store만 있는 경우 사용
 */
type ProductWithStore = Prisma.ProductGetPayload<{
  include: {
    store: {
      select: {
        name: true;
        logoImageUrl: true;
        address: true;
        roadAddress: true;
        zonecode: true;
        latitude: true;
        longitude: true;
      };
    };
  };
}>;

/**
 * Prisma ProductGetPayload를 기반으로 한 Product 타입
 * reviews와 store가 include된 경우 사용
 */
export type ProductWithReviewsAndStore = Prisma.ProductGetPayload<{
  include: {
    reviews: {
      select: {
        rating: true;
      };
    };
    store: {
      select: {
        name: true;
        logoImageUrl: true;
        address: true;
        roadAddress: true;
        zonecode: true;
        latitude: true;
        longitude: true;
      };
    };
  };
}>;

/**
 * 상품 매핑 유틸리티 클래스
 */
export class ProductMapperUtil {
  /**
   * Store 기본 정보 및 위치 정보 select 필드
   * 상품 조회 시 store의 이름, 이미지, 위치 정보를 가져오기 위한 공통 select 필드
   */
  static readonly STORE_INFO_SELECT = {
    name: true,
    logoImageUrl: true,
    address: true,
    roadAddress: true,
    zonecode: true,
    latitude: true,
    longitude: true,
  } as const satisfies Prisma.StoreSelect;

  /**
   * Store 기본 정보, 위치 정보 및 userId select 필드
   * 권한 확인이 필요한 경우 사용
   */
  static readonly STORE_INFO_WITH_USER_ID_SELECT = {
    ...ProductMapperUtil.STORE_INFO_SELECT,
    userId: true,
  } as const satisfies Prisma.StoreSelect;

  /**
   * Reviews rating만 select하는 필드
   * include 내부에서 사용
   */
  static readonly REVIEWS_RATING_SELECT_ONLY = {
    rating: true,
  } as const satisfies Prisma.ProductReviewSelect;

  /**
   * Prisma Product 엔티티를 ProductResponseDto로 변환
   * @param product - Prisma Product 엔티티 (store 포함 가능, reviews 포함 가능)
   * @param isLiked - 좋아요 여부 (옵셔널, 로그인한 사용자의 경우에만 제공)
   * @returns ProductResponseDto 객체
   */
  static mapToProductResponse(
    product: ProductWithStore | ProductWithReviewsAndStore,
    isLiked?: boolean | null,
  ): ProductResponseDto {
    const { store, ...productData } = product;

    // 후기 통계 계산
    let averageRating = 0;
    let totalReviewCount = 0;

    if ("reviews" in productData) {
      const reviews = (productData as ProductWithReviewsAndStore).reviews;
      totalReviewCount = reviews.length;

      if (totalReviewCount > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = Math.round((totalRating / totalReviewCount) * 10) / 10; // 소수점 첫째자리까지
      }
    }

    // reviews가 있는 경우 제거
    const rest =
      "reviews" in productData
        ? (() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { reviews: _reviews, ...restData } = productData as ProductWithReviewsAndStore;
            return restData;
          })()
        : productData;

    return {
      ...rest,
      averageRating,
      totalReviewCount,
      isLiked: isLiked !== undefined ? isLiked : null,
      storeName: store?.name || "",
      storeLogoImageUrl: store?.logoImageUrl || undefined,
      pickupAddress: store?.address || "",
      pickupRoadAddress: store?.roadAddress || "",
      pickupZonecode: store?.zonecode || "",
      pickupLatitude: store?.latitude || 0,
      pickupLongitude: store?.longitude || 0,
    } as ProductResponseDto;
  }
}
