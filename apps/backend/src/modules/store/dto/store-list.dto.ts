import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsEnum } from "class-validator";
import { IsValidRegionsParam } from "@apps/backend/modules/store/decorators/validators.decorator";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";
import { PaginationRequestDto } from "@apps/backend/common/dto/pagination-request.dto";
import { StoreResponseDto } from "./store-detail.dto";
import {
  StoreSortBy,
  SWAGGER_EXAMPLES,
} from "@apps/backend/modules/store/constants/store.constants";

/**
 * 사용자용 스토어 목록 조회 요청 DTO
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

  @ApiPropertyOptional({
    description:
      "(필터) 지역. 해당 파라미터를 비워두면 전국 스토어를 조회합니다." +
      "GET /store/regions 응답의 depth1·depth2 searchKeywords를 조합해 전달합니다. " +
      "'depth1키워드:depth2키워드' 쌍을 쉼표로 구분." +
      "2depth가 복수 키워드(예: 강화·옹진)면 각 searchKeywords마다 한 쌍으로 보냅니다. " +
      "예시: '전지역', '전지역:전지역', '서울:전지역', '서울:전지역,경기:수원시', '경기:수원시,인천:강화군,인천:옹진군'",
    example: "서울:전지역,경기:수원시",
  })
  @IsValidRegionsParam()
  regions?: string;
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
