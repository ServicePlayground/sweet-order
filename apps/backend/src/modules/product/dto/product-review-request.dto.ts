import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsArray,
  IsNotEmpty,
} from "class-validator";
import {
  StringToNumber,
  OptionalStringToNumber,
} from "@apps/backend/common/decorators/transform.decorator";
import { ReviewSortBy } from "@apps/backend/modules/product/constants/product.constants";

/**
 * 후기 목록 조회 요청 DTO (무한 스크롤)
 */
export class GetProductReviewsRequestDto {
  @ApiProperty({
    description: "(무한 스크롤 필수) 페이지 번호 (1부터 시작)",
    example: 1,
  })
  @StringToNumber()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({
    description: "(무한 스크롤 필수) 조회할 항목 수",
    example: 20,
  })
  @StringToNumber()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number;

  @ApiProperty({
    description: "정렬",
    enum: ReviewSortBy,
    example: ReviewSortBy.LATEST,
  })
  @IsNotEmpty()
  @IsEnum(ReviewSortBy)
  sortBy: ReviewSortBy;
}

