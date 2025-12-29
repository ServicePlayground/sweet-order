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
import {
  SortBy,
  OptionRequired,
  EnableStatus,
} from "@apps/backend/modules/product/constants/product.constants";
import { SWAGGER_EXAMPLES as STORE_SWAGGER_EXAMPLES } from "@apps/backend/modules/store/constants/store.constants";
import { SWAGGER_EXAMPLES as PRODUCT_SWAGGER_EXAMPLES } from "@apps/backend/modules/product/constants/product.constants";
import { ValidateNested, IsIn } from "class-validator";
import { Type } from "class-transformer";

/**
 * 상품 목록 조회 요청 DTO (무한 스크롤)
 */
export class GetProductsRequestDto {
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
    example: 30,
  })
  @StringToNumber()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number;

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
}

/**
 * 케이크 사이즈 옵션 DTO
 */
export class CakeSizeOptionDto {
  @ApiProperty({
    description: "노출 여부",
    enum: EnableStatus,
    example: EnableStatus.ENABLE,
  })
  @IsNotEmpty()
  @IsEnum(EnableStatus)
  visible: EnableStatus;

  @ApiProperty({
    description: "표시명",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.cakeSizeOptions[0].displayName,
  })
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @ApiProperty({
    description: "설명",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.cakeSizeOptions[0].description,
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}

/**
 * 케이크 맛 옵션 DTO
 */
export class CakeFlavorOptionDto {
  @ApiProperty({
    description: "노출 여부",
    enum: EnableStatus,
    example: EnableStatus.ENABLE,
  })
  @IsNotEmpty()
  @IsEnum(EnableStatus)
  visible: EnableStatus;

  @ApiProperty({
    description: "표시명",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.cakeFlavorOptions[0].displayName,
  })
  @IsNotEmpty()
  @IsString()
  displayName: string;
}

/**
 * 상품 등록 요청 DTO
 */
export class CreateProductRequestDto {
  @ApiProperty({
    description: "스토어 ID",
    example: STORE_SWAGGER_EXAMPLES.ID,
  })
  @IsNotEmpty()
  @IsString()
  storeId: string;

  @ApiProperty({
    description: "상품명",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.name,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "대표이미지 URL",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.mainImage,
  })
  @IsNotEmpty()
  @IsString()
  mainImage: string;

  @ApiPropertyOptional({
    description: "추가이미지 URL 목록",
    isArray: true,
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.additionalImages,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalImages?: string[];

  @ApiProperty({
    description: "판매가",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.salePrice,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  salePrice: number;

  @ApiProperty({
    description: "판매여부",
    enum: EnableStatus,
    example: EnableStatus.ENABLE,
  })
  @IsNotEmpty()
  @IsEnum(EnableStatus)
  salesStatus: EnableStatus;

  @ApiProperty({
    description: "노출여부",
    enum: EnableStatus,
    example: EnableStatus.ENABLE,
  })
  @IsNotEmpty()
  @IsEnum(EnableStatus)
  visibilityStatus: EnableStatus;

  @ApiPropertyOptional({
    description: "케이크 옵션 - 사이즈 목록",
    type: [CakeSizeOptionDto],
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.cakeSizeOptions,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CakeSizeOptionDto)
  cakeSizeOptions?: CakeSizeOptionDto[];

  @ApiPropertyOptional({
    description: "케이크 옵션 - 맛 목록",
    type: [CakeFlavorOptionDto],
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.cakeFlavorOptions,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CakeFlavorOptionDto)
  cakeFlavorOptions?: CakeFlavorOptionDto[];

  @ApiPropertyOptional({
    description: "레터링 문구 사용 여부",
    enum: EnableStatus,
    example: EnableStatus.ENABLE,
  })
  @IsNotEmpty()
  @IsEnum(EnableStatus)
  letteringVisible: EnableStatus;

  @ApiPropertyOptional({
    description: "레터링 문구 사용 (필수/선택)",
    enum: OptionRequired,
    example: OptionRequired.REQUIRED,
  })
  @IsNotEmpty()
  @IsEnum(OptionRequired)
  letteringRequired: OptionRequired;

  @ApiPropertyOptional({
    description: "레터링 최대 글자 수",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.letteringMaxLength,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  letteringMaxLength: number;

  @ApiPropertyOptional({
    description: "이미지 등록 사용여부",
    enum: EnableStatus,
    example: EnableStatus.ENABLE,
  })
  @IsNotEmpty()
  @IsEnum(EnableStatus)
  imageUploadEnabled: EnableStatus;

  // 13. 상세 정보(현재와 동일, 문자열, HTML)
  @ApiPropertyOptional({
    description: "상세 설명 (HTML)",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.detailDescription,
  })
  @IsOptional()
  @IsString()
  detailDescription?: string;

  @ApiProperty({
    description: "식품의 유형",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeFoodType,
  })
  @IsNotEmpty()
  @IsString()
  productNoticeFoodType: string;

  @ApiProperty({
    description: "제조사",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeProducer,
  })
  @IsNotEmpty()
  @IsString()
  productNoticeProducer: string;

  @ApiProperty({
    description: "원산지",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeOrigin,
  })
  @IsNotEmpty()
  @IsString()
  productNoticeOrigin: string;

  @ApiProperty({
    description: "소재지",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeAddress,
  })
  @IsNotEmpty()
  @IsString()
  productNoticeAddress: string;

  @ApiProperty({
    description: "제조연월일",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeManufactureDate,
  })
  @IsNotEmpty()
  @IsString()
  productNoticeManufactureDate: string;

  @ApiProperty({
    description: "소비기한 또는 품질유지기한",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeExpirationDate,
  })
  @IsNotEmpty()
  @IsString()
  productNoticeExpirationDate: string;

  @ApiProperty({
    description: "포장단위별 용량/수량",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticePackageCapacity,
  })
  @IsNotEmpty()
  @IsString()
  productNoticePackageCapacity: string;

  @ApiProperty({
    description: "포장 단위별 수량",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticePackageQuantity,
  })
  @IsNotEmpty()
  @IsString()
  productNoticePackageQuantity: string;

  @ApiProperty({
    description: "원재료명 및 함량",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeIngredients,
  })
  @IsNotEmpty()
  @IsString()
  productNoticeIngredients: string;

  @ApiProperty({
    description: "영양성분",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeCalories,
  })
  @IsNotEmpty()
  @IsString()
  productNoticeCalories: string;

  @ApiProperty({
    description: "소비자안전을 위한 주의사항",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeSafetyNotice,
  })
  @IsNotEmpty()
  @IsString()
  productNoticeSafetyNotice: string;

  @ApiProperty({
    description: "유전자변형식품에 해당하는 경우의 표시",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeGmoNotice,
  })
  @IsNotEmpty()
  @IsString()
  productNoticeGmoNotice: string;

  @ApiProperty({
    description: "수입식품의 경우",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeImportNotice,
  })
  @IsNotEmpty()
  @IsString()
  productNoticeImportNotice: string;

  @ApiProperty({
    description: "고객센터",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeCustomerService,
  })
  @IsNotEmpty()
  @IsString()
  productNoticeCustomerService: string;
}
