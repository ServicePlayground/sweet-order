import { ApiProperty } from "@nestjs/swagger";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";
import { StoreResponseDto } from "./store-detail.dto";

/**
 * 스토어 목록 조회 응답 DTO
 */
export class StoreListResponseDto {
  @ApiProperty({
    description: "스토어 목록",
    type: [StoreResponseDto],
  })
  data: StoreResponseDto[];

  @ApiProperty({
    description: "페이지네이션 메타 정보",
    type: PaginationMetaResponseDto,
  })
  meta: PaginationMetaResponseDto;
}
