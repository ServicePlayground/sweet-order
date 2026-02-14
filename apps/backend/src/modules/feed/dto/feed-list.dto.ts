import { ApiProperty } from "@nestjs/swagger";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";
import { FeedResponseDto } from "./feed-detail.dto";

/**
 * 피드 목록 조회 응답 DTO
 */
export class FeedListResponseDto {
  @ApiProperty({
    description: "피드 목록",
    type: [FeedResponseDto],
  })
  data: FeedResponseDto[];

  @ApiProperty({
    description: "페이지네이션 메타 정보",
    type: PaginationMetaResponseDto,
  })
  meta: PaginationMetaResponseDto;
}
