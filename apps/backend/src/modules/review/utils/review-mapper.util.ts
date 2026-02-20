import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { ReviewResponseDto } from "@apps/backend/modules/review/dto/review-detail.dto";

/**
 * User 및 Product(Store) 정보가 포함된 ProductReview 타입
 */
type ProductReviewWithUserAndProductStore = Prisma.ProductReviewGetPayload<{
  include: {
    user: {
      select: {
        nickname: true;
        profileImageUrl: true;
      };
    };
    product: {
      include: { store: { select: { name: true } } };
    };
  };
}>;

/**
 * 후기 매핑 유틸리티
 * Prisma ProductReview 엔티티를 ReviewResponseDto로 변환하는 공통 로직을 제공합니다.
 */
export class ReviewMapperUtil {
  /**
   * User 정보 select 필드
   * 후기 조회 시 user의 nickname과 profileImageUrl을 가져오기 위한 공통 select 필드
   */
  static readonly USER_INFO_SELECT = {
    nickname: true,
    profileImageUrl: true,
  } as const satisfies Prisma.UserSelect;

  /**
   * Product + Store 정보 include
   * 후기 조회 시 storeId, storeName을 응답에 포함하기 위한 공통 include
   */
  static readonly PRODUCT_STORE_INCLUDE = {
    product: {
      include: { store: { select: { name: true } } },
    },
  } as const;

  /**
   * Prisma ProductReview 엔티티를 ReviewResponseDto로 변환
   * @param review - Prisma ProductReview 엔티티 (user, product.store 포함)
   * @returns ReviewResponseDto 객체
   */
  static mapToReviewResponse(
    review: ProductReviewWithUserAndProductStore,
  ): ReviewResponseDto {
    return {
      id: review.id,
      productId: review.productId,
      storeId: review.product.storeId,
      storeName: review.product.store.name,
      userId: review.userId,
      rating: review.rating,
      content: review.content,
      imageUrls: review.imageUrls,
      userNickname: review.user.nickname,
      userProfileImageUrl: review.user.profileImageUrl,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }
}
