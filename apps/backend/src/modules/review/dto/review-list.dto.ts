import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { ReviewSortBy } from "@apps/backend/modules/review/constants/review.constants";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";
import { PaginationRequestDto } from "@apps/backend/common/dto/pagination-request.dto";
import { ReviewResponseDto } from "@apps/backend/modules/review/dto/review-detail.dto";

/**
 * 후기 목록 조회 요청 DTO (무한 스크롤)
 */
export class GetReviewsRequestDto extends PaginationRequestDto {
  @ApiProperty({
    description: "정렬",
    enum: ReviewSortBy,
    example: ReviewSortBy.LATEST,
  })
  @IsNotEmpty()
  @IsEnum(ReviewSortBy)
  sortBy: ReviewSortBy;
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
    type: PaginationMetaResponseDto,
  })
  meta: PaginationMetaResponseDto;
}
