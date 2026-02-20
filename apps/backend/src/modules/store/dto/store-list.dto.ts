import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsEnum } from "class-validator";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";
import { PaginationRequestDto } from "@apps/backend/common/dto/pagination-request.dto";
import { StoreResponseDto } from "./store-detail.dto";
import { StoreSortBy, SWAGGER_EXAMPLES } from "@apps/backend/modules/store/constants/store.constants";

/**
 * 스토어 목록 조회 요청 DTO (사용자용)
 */
export class GetStoresRequestDto extends PaginationRequestDto {
  @ApiPropertyOptional({
    description: "검색어 (스토어명 검색)",
    example: SWAGGER_EXAMPLES.NAME,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "정렬",
    enum: StoreSortBy,
    example: StoreSortBy.POPULAR,
  })
  @IsOptional()
  @IsEnum(StoreSortBy)
  sortBy?: StoreSortBy;
}

/**
 * 판매자용 스토어 목록 조회 요청 DTO (내 스토어 목록)
 */
export class GetSellerStoresRequestDto extends GetStoresRequestDto {}

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
