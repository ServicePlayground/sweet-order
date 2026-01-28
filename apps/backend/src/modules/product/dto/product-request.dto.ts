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
  ProductType,
  CakeSizeDisplayName,
} from "@apps/backend/modules/product/constants/product.constants";
import { SWAGGER_EXAMPLES as STORE_SWAGGER_EXAMPLES } from "@apps/backend/modules/store/constants/store.constants";
import { SWAGGER_EXAMPLES as PRODUCT_SWAGGER_EXAMPLES } from "@apps/backend/modules/product/constants/product.constants";
import { ValidateNested } from "class-validator";
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

  @ApiPropertyOptional({
    description: "(필터) 상품 타입 - BASIC_CAKE 또는 CUSTOM_CAKE",
    enum: ProductType,
    example: ProductType.CUSTOM_CAKE,
  })
  @IsOptional()
  @IsEnum(ProductType)
  productType?: ProductType;
}

/**
 * 판매자용 상품 목록 조회 요청 DTO (무한 스크롤)
 */
export class GetSellerProductsRequestDto {
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
    example: SortBy.LATEST,
  })
  @IsNotEmpty()
  @IsEnum(SortBy)
  sortBy: SortBy;

  @ApiPropertyOptional({
    description: "(필터) 스토어 ID - 자신이 소유한 스토어의 상품만 조회",
    example: STORE_SWAGGER_EXAMPLES.ID,
  })
  @IsOptional()
  @IsString()
  storeId?: string;

  @ApiPropertyOptional({
    description: "(전체 검색일 경우 생략) 검색 키워드",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.name,
  })
  @IsOptional()
  @IsString()
  search?: string;

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
    description: "(필터) 상품 타입 - BASIC_CAKE 또는 CUSTOM_CAKE",
    enum: ProductType,
    example: ProductType.CUSTOM_CAKE,
  })
  @IsOptional()
  @IsEnum(ProductType)
  productType?: ProductType;
}

/**
 * 케이크 사이즈 옵션 DTO
 */
export class CakeSizeOptionDto {
  @ApiPropertyOptional({
    description: "옵션 고유 ID (수정 시 그대로 전달)",
    example: "size_abcd1234",
  })
  @IsNotEmpty()
  @IsString()
  id: string;

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
    enum: CakeSizeDisplayName,
    example: CakeSizeDisplayName.MINI,
  })
  @IsNotEmpty()
  @IsEnum(CakeSizeDisplayName)
  displayName: CakeSizeDisplayName;

  @ApiProperty({
    description: "케이크 지름/길이 (cm 단위, 숫자만)",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.cakeSizeOptions[0].lengthCm,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  lengthCm: number;

  @ApiProperty({
    description: "해당 사이즈의 가격",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.cakeSizeOptions[0].price,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: "설명",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.cakeSizeOptions[0].description,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

/**
 * 케이크 맛 옵션 DTO
 */
export class CakeFlavorOptionDto {
  @ApiPropertyOptional({
    description: "옵션 고유 ID (수정 시 그대로 전달)",
    example: "flavor_efgh5678",
  })
  @IsNotEmpty()
  @IsString()
  id: string;

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

  @ApiProperty({
    description: "해당 맛 옵션의 추가 가격",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.cakeFlavorOptions[0].price,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
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
    description: "이미지 URL 목록 (첫 번째 요소가 대표 이미지, 필수)",
    isArray: true,
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.images,
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  images: string[];

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

/**
 * 상품 수정 요청 DTO
 */
export class UpdateProductRequestDto {
  @ApiPropertyOptional({
    description: "상품명",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.name,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: "이미지 URL 목록 (첫 번째 요소가 대표 이미지)",
    isArray: true,
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.images,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: "판매가",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.salePrice,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @ApiPropertyOptional({
    description: "판매여부",
    enum: EnableStatus,
    example: EnableStatus.ENABLE,
  })
  @IsOptional()
  @IsEnum(EnableStatus)
  salesStatus?: EnableStatus;

  @ApiPropertyOptional({
    description: "노출여부",
    enum: EnableStatus,
    example: EnableStatus.ENABLE,
  })
  @IsOptional()
  @IsEnum(EnableStatus)
  visibilityStatus?: EnableStatus;

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
  @IsOptional()
  @IsEnum(EnableStatus)
  letteringVisible?: EnableStatus;

  @ApiPropertyOptional({
    description: "레터링 문구 사용 (필수/선택)",
    enum: OptionRequired,
    example: OptionRequired.REQUIRED,
  })
  @IsOptional()
  @IsEnum(OptionRequired)
  letteringRequired?: OptionRequired;

  @ApiPropertyOptional({
    description: "레터링 최대 글자 수",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.letteringMaxLength,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  letteringMaxLength?: number;

  @ApiPropertyOptional({
    description: "이미지 등록 사용여부",
    enum: EnableStatus,
    example: EnableStatus.ENABLE,
  })
  @IsOptional()
  @IsEnum(EnableStatus)
  imageUploadEnabled?: EnableStatus;

  @ApiPropertyOptional({
    description: "상세 설명 (HTML)",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.detailDescription,
  })
  @IsOptional()
  @IsString()
  detailDescription?: string;

  @ApiPropertyOptional({
    description: "식품의 유형",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeFoodType,
  })
  @IsOptional()
  @IsString()
  productNoticeFoodType?: string;

  @ApiPropertyOptional({
    description: "제조사",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeProducer,
  })
  @IsOptional()
  @IsString()
  productNoticeProducer?: string;

  @ApiPropertyOptional({
    description: "원산지",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeOrigin,
  })
  @IsOptional()
  @IsString()
  productNoticeOrigin?: string;

  @ApiPropertyOptional({
    description: "소재지",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeAddress,
  })
  @IsOptional()
  @IsString()
  productNoticeAddress?: string;

  @ApiPropertyOptional({
    description: "제조연월일",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeManufactureDate,
  })
  @IsOptional()
  @IsString()
  productNoticeManufactureDate?: string;

  @ApiPropertyOptional({
    description: "소비기한 또는 품질유지기한",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeExpirationDate,
  })
  @IsOptional()
  @IsString()
  productNoticeExpirationDate?: string;

  @ApiPropertyOptional({
    description: "포장단위별 용량/수량",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticePackageCapacity,
  })
  @IsOptional()
  @IsString()
  productNoticePackageCapacity?: string;

  @ApiPropertyOptional({
    description: "포장 단위별 수량",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticePackageQuantity,
  })
  @IsOptional()
  @IsString()
  productNoticePackageQuantity?: string;

  @ApiPropertyOptional({
    description: "원재료명 및 함량",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeIngredients,
  })
  @IsOptional()
  @IsString()
  productNoticeIngredients?: string;

  @ApiPropertyOptional({
    description: "영양성분",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeCalories,
  })
  @IsOptional()
  @IsString()
  productNoticeCalories?: string;

  @ApiPropertyOptional({
    description: "소비자안전을 위한 주의사항",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeSafetyNotice,
  })
  @IsOptional()
  @IsString()
  productNoticeSafetyNotice?: string;

  @ApiPropertyOptional({
    description: "유전자변형식품에 해당하는 경우의 표시",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeGmoNotice,
  })
  @IsOptional()
  @IsString()
  productNoticeGmoNotice?: string;

  @ApiPropertyOptional({
    description: "수입식품의 경우",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeImportNotice,
  })
  @IsOptional()
  @IsString()
  productNoticeImportNotice?: string;

  @ApiPropertyOptional({
    description: "고객센터",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeCustomerService,
  })
  @IsOptional()
  @IsString()
  productNoticeCustomerService?: string;
}
