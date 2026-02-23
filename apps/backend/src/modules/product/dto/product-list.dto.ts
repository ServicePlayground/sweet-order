import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsEnum, IsNumber, Min, IsArray, IsNotEmpty } from "class-validator";
import {
  OptionalStringToNumber,
  OptionalStringToArray,
} from "@apps/backend/common/decorators/transform.decorator";
import { IsValidRegionsParam } from "@apps/backend/modules/store/decorators/validators.decorator";
import {
  SortBy,
  EnableStatus,
  ProductType,
  ProductCategoryType,
} from "@apps/backend/modules/product/constants/product.constants";
import { SWAGGER_EXAMPLES as STORE_SWAGGER_EXAMPLES } from "@apps/backend/modules/store/constants/store.constants";
import { SWAGGER_EXAMPLES as PRODUCT_SWAGGER_EXAMPLES } from "@apps/backend/modules/product/constants/product.constants";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";
import { PaginationRequestDto } from "@apps/backend/common/dto/pagination-request.dto";
import { ProductResponseDto } from "@apps/backend/modules/product/dto/product-detail.dto";

/**
 * 사용자용 상품 목록 조회 요청 DTO (무한 스크롤)
 */
export class GetProductsRequestDto extends PaginationRequestDto {
  @ApiProperty({
    description: "정렬",
    enum: SortBy,
    example: SortBy.POPULAR,
  })
  @IsNotEmpty()
  @IsEnum(SortBy)
  sortBy: SortBy;

  @ApiPropertyOptional({
    description: "(전체 검색일 경우 생략) 검색 키워드",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.name,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: "(필터) 최소 가격", example: 10000 })
  @OptionalStringToNumber()
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: "(필터) 최대 가격", example: 100000 })
  @OptionalStringToNumber()
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: "(필터) 스토어 ID - 특정 스토어의 상품만 조회",
    example: STORE_SWAGGER_EXAMPLES.ID,
  })
  @IsOptional()
  @IsString()
  storeId?: string;

  @ApiPropertyOptional({
    description: "(필터) 상품 타입 - BASIC_CAKE 또는 CUSTOM_CAKE",
    enum: ProductType,
    example: ProductType.CUSTOM_CAKE,
  })
  @IsOptional()
  @IsEnum(ProductType)
  productType?: ProductType;

  @ApiPropertyOptional({
    description:
      "(필터) 상품 카테고리 타입 - 1개 또는 여러 개. 해당 타입 중 하나라도 가지면 조회 (생일, 연인, 친구, 가족, 기념일, 당일픽업, 레터링, 캐릭터, 심플, 꽃, 사진)",
    enum: ProductCategoryType,
    isArray: true,
    example: [ProductCategoryType.BIRTHDAY],
  })
  @IsOptional()
  @OptionalStringToArray()
  @IsArray()
  @IsEnum(ProductCategoryType, { each: true })
  productCategoryTypes?: ProductCategoryType[];

  @ApiPropertyOptional({
    description:
      "(필터) 지역 - 전지역일 때는 미지정 또는 '전지역', '1depth:2depth' 쌍을 쉼표로 구분. 특별시,자치시,광역시,시군구 등 모두 제외한 지역의 단어만 전달합니다. 예시1: 전지역, 예시2: 서울:전지역, 예시3: 서울:전지역,경기:수원, 예시4: 서울:강남,경기:수원",
    example: "서울:전지역,경기:수원",
  })
  @IsValidRegionsParam()
  regions?: string;
}

/**
 * 판매자용 상품 목록 조회 요청 DTO (무한 스크롤)
 */
export class GetSellerProductsRequestDto extends GetProductsRequestDto {
  @ApiPropertyOptional({
    description: "(필터) 판매 상태",
    enum: EnableStatus,
    example: EnableStatus.ENABLE,
  })
  @IsOptional()
  @IsEnum(EnableStatus)
  salesStatus?: EnableStatus;

  @ApiPropertyOptional({
    description: "(필터) 노출 상태",
    enum: EnableStatus,
    example: EnableStatus.ENABLE,
  })
  @IsOptional()
  @IsEnum(EnableStatus)
  visibilityStatus?: EnableStatus;
}

/**
 * 상품 목록 조회 응답 DTO
 */
export class ProductListResponseDto {
  @ApiProperty({
    description: "상품 목록",
    type: [ProductResponseDto],
  })
  data: ProductResponseDto[];

  @ApiProperty({
    description: "페이지네이션 메타 정보",
    type: PaginationMetaResponseDto,
  })
  meta: PaginationMetaResponseDto;
}
