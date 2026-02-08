import { ApiProperty } from "@nestjs/swagger";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/product/constants/product.constants";

/**
 * 후기 응답 DTO
 */
export class ReviewResponseDto {
  @ApiProperty({
    description: "후기 ID",
    example: "review_123456789",
  })
  id: string;

  @ApiProperty({
    description: "상품 ID",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.id,
  })
  productId: string;

  @ApiProperty({
    description: "사용자 ID",
    example: "user_123456789",
  })
  userId: string;

  @ApiProperty({
    description: "별점 (0.0 ~ 5.0)",
    example: 4.5,
    minimum: 0,
    maximum: 5,
  })
  rating: number;

  @ApiProperty({
    description: "후기 내용",
    example: "정말 맛있었어요! 다음에도 주문할게요.",
  })
  content: string;

  @ApiProperty({
    description: "후기 이미지 URL 목록",
    type: [String],
    example: ["https://example.com/review-image1.jpg", "https://example.com/review-image2.jpg"],
  })
  imageUrls: string[];

  @ApiProperty({
    description: "사용자 닉네임",
    example: "철수킹",
  })
  userNickname: string | null;

  @ApiProperty({
    description: "사용자 프로필 이미지 URL",
    example: "https://example.com/profile/kimcs.jpg",
    nullable: true,
  })
  userProfileImageUrl: string | null;

  @ApiProperty({
    description: "생성일시",
    example: new Date("2024-01-20T14:25:00.000Z"),
  })
  createdAt: Date;

  @ApiProperty({
    description: "수정일시",
    example: new Date("2024-01-20T14:25:00.000Z"),
  })
  updatedAt: Date;
}

/**
 * 페이지네이션 메타 정보 응답 DTO
 */
export class ReviewPaginationMetaResponseDto {
  @ApiProperty({
    description: "현재 페이지 번호",
    example: SWAGGER_EXAMPLES.PAGINATION_META.currentPage,
  })
  currentPage: number;

  @ApiProperty({
    description: "페이지당 항목 수",
    example: SWAGGER_EXAMPLES.PAGINATION_META.limit,
  })
  limit: number;

  @ApiProperty({
    description: "전체 항목 수",
    example: SWAGGER_EXAMPLES.PAGINATION_META.totalItems,
  })
  totalItems: number;

  @ApiProperty({
    description: "전체 페이지 수",
    example: SWAGGER_EXAMPLES.PAGINATION_META.totalPages,
  })
  totalPages: number;

  @ApiProperty({
    description: "다음 페이지 존재 여부",
    example: SWAGGER_EXAMPLES.PAGINATION_META.hasNext,
  })
  hasNext: boolean;

  @ApiProperty({
    description: "이전 페이지 존재 여부",
    example: SWAGGER_EXAMPLES.PAGINATION_META.hasPrev,
  })
  hasPrev: boolean;
}

/**
 * 후기 목록 조회 응답 DTO
 */
export class ReviewListResponseDto {
  @ApiProperty({
    description: "후기 목록",
    type: [ReviewResponseDto],
  })
  data: ReviewResponseDto[];

  @ApiProperty({
    description: "페이지네이션 메타 정보",
    type: ReviewPaginationMetaResponseDto,
  })
  meta: ReviewPaginationMetaResponseDto;
}
