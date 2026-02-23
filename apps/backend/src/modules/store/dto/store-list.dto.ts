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
      "(필터) 지역 - 전지역일 때는 미지정 또는 '전지역', '1depth:2depth' 쌍을 쉼표로 구분. 특별시,자치시,광역시,시군구 등 모두 제외한 지역의 단어만 전달합니다. 예시1: 전지역, 예시2: 서울:전지역, 예시3: 서울:전지역,경기:수원, 예시4: 서울:강남,경기:수원",
    example: "서울:전지역,경기:수원",
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
