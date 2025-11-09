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
  IsObject,
  ArrayMinSize,
} from "class-validator";
import {
  StringToArray,
  StringToNumber,
  OptionalStringToNumber,
} from "@apps/backend/common/decorators/transform.decorator";
import {
  DeliveryMethod,
  MainCategory,
  SortBy,
  SizeRange,
  ProductStatus,
} from "@apps/backend/modules/product/constants/product.constants";
import { SWAGGER_EXAMPLES as STORE_SWAGGER_EXAMPLES } from "@apps/backend/modules/store/constants/store.constants";
import { SWAGGER_EXAMPLES as PRODUCT_SWAGGER_EXAMPLES } from "@apps/backend/modules/product/constants/product.constants";

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

  @ApiPropertyOptional({
    description: "(필터) 메인 카테고리",
    enum: MainCategory,
    example: MainCategory.CAKE,
  })
  @IsOptional()
  @IsEnum(MainCategory)
  mainCategory?: MainCategory;

  @ApiPropertyOptional({
    description: "(필터) 인원 수 - (중복가능)쉼표로 구분하여 전달",
    enum: SizeRange,
    type: "string",
    example: `${SizeRange.ONE_TO_TWO},${SizeRange.TWO_TO_THREE}`,
  })
  @StringToArray()
  @IsOptional()
  @IsArray()
  @IsEnum(SizeRange, { each: true })
  sizeRange?: SizeRange[];

  @ApiPropertyOptional({
    description: "(필터) 수령 방식 - (중복가능)쉼표로 구분하여 전달",
    enum: DeliveryMethod,
    type: "string",
    example: `${DeliveryMethod.PICKUP},${DeliveryMethod.DELIVERY}`,
  })
  @StringToArray()
  @IsOptional()
  @IsArray()
  @IsEnum(DeliveryMethod, { each: true })
  deliveryMethod?: DeliveryMethod[];

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

  @ApiPropertyOptional({
    description: "상품 설명",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.description,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "원가",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.originalPrice,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  originalPrice: number;

  @ApiProperty({
    description: "판매가",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.salePrice,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  salePrice: number;

  @ApiProperty({
    description: "재고 수량",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.stock,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({
    description: "공지사항",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.notice,
  })
  @IsOptional()
  @IsString()
  notice?: string;

  @ApiPropertyOptional({
    description: "주의사항",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.caution,
  })
  @IsOptional()
  @IsString()
  caution?: string;

  @ApiPropertyOptional({
    description: "기본 포함 사항",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.basicIncluded,
  })
  @IsOptional()
  @IsString()
  basicIncluded?: string;

  @ApiPropertyOptional({
    description: "위치",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.location,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: "주문 폼 스키마 (JSON)",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.orderFormSchema,
  })
  @IsOptional()
  @IsObject()
  orderFormSchema?: any;

  @ApiPropertyOptional({
    description: "상세 설명 (HTML)",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.detailDescription,
  })
  @IsOptional()
  @IsString()
  detailDescription?: string;

  @ApiPropertyOptional({
    description: "취소 및 환불 상세 설명",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.cancellationRefundDetailDescription,
  })
  @IsOptional()
  @IsString()
  cancellationRefundDetailDescription?: string;

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

  @ApiProperty({
    description: "메인 카테고리",
    enum: MainCategory,
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.mainCategory,
  })
  @IsNotEmpty()
  @IsEnum(MainCategory)
  mainCategory: MainCategory;

  @ApiProperty({
    description: "인원 수 범위 (배열)",
    enum: SizeRange,
    isArray: true,
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.sizeRange,
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(SizeRange, { each: true })
  sizeRange: SizeRange[];

  @ApiProperty({
    description: "배송 방법 (배열)",
    enum: DeliveryMethod,
    isArray: true,
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.deliveryMethod,
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(DeliveryMethod, { each: true })
  deliveryMethod: DeliveryMethod[];

  @ApiPropertyOptional({
    description: "해시태그 (배열)",
    isArray: true,
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.hashtags,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];

  @ApiPropertyOptional({
    description: "상품 상태",
    enum: ProductStatus,
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.status,
    default: ProductStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({
    description: "상품 이미지 URL 목록",
    isArray: true,
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.images,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
