import { ApiProperty } from "@nestjs/swagger";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/product/constants/product.constants";

/**
 * 페이지네이션 메타 정보 응답 DTO
 */
export class PaginationMetaResponseDto {
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
