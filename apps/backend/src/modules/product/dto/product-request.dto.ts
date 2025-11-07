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
    example: "크리스마스 케이크",
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
}

/**
 * 상품 등록 요청 DTO
 */
export class CreateProductRequestDto {
  @ApiProperty({
    description: "스토어 ID",
    example: "store_123456789",
  })
  @IsNotEmpty()
  @IsString()
  storeId: string;

  @ApiProperty({
    description: "상품명",
    example: "초콜릿 케이크",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: "상품 설명",
    example: "달콤한 초콜릿으로 만든 케이크입니다.",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "원가",
    example: 50000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  originalPrice: number;

  @ApiProperty({
    description: "판매가",
    example: 45000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  salePrice: number;

  @ApiProperty({
    description: "재고 수량",
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({
    description: "공지사항",
    example: "주문 후 1-2일 내 제작 완료",
  })
  @IsOptional()
  @IsString()
  notice?: string;

  @ApiPropertyOptional({
    description: "주의사항",
    example: "알레르기 주의: 우유, 계란, 밀 함유",
  })
  @IsOptional()
  @IsString()
  caution?: string;

  @ApiPropertyOptional({
    description: "기본 포함 사항",
    example: "케이크, 촛불, 포크",
  })
  @IsOptional()
  @IsString()
  basicIncluded?: string;

  @ApiPropertyOptional({
    description: "위치",
    example: "서울시 강남구",
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: "주문 폼 스키마 (JSON)",
    example: {
      fields: [
        {
          id: "size",
          type: "selectbox",
          label: "사이즈 선택",
          required: true,
          options: [
            { value: "1호", label: "1호", price: 0 },
            { value: "2호", label: "2호", price: 10000 },
          ],
        },
      ],
    },
  })
  @IsOptional()
  @IsObject()
  orderFormSchema?: any;

  @ApiPropertyOptional({
    description: "상세 설명 (HTML)",
    example: "<p>고급 초콜릿으로 만든 프리미엄 케이크입니다.</p>",
  })
  @IsOptional()
  @IsString()
  detailDescription?: string;

  @ApiPropertyOptional({
    description: "식품 유형",
    example: "케이크류",
  })
  @IsOptional()
  @IsString()
  foodType?: string;

  @ApiPropertyOptional({
    description: "제조사",
    example: "스위트오더",
  })
  @IsOptional()
  @IsString()
  producer?: string;

  @ApiPropertyOptional({
    description: "제조일자",
    example: "제조일로부터 3일",
  })
  @IsOptional()
  @IsString()
  manufactureDate?: string;

  @ApiPropertyOptional({
    description: "포장 정보",
    example: "1개",
  })
  @IsOptional()
  @IsString()
  packageInfo?: string;

  @ApiPropertyOptional({
    description: "칼로리",
    example: "350kcal",
  })
  @IsOptional()
  @IsString()
  calories?: string;

  @ApiPropertyOptional({
    description: "원재료",
    example: "초콜릿, 밀가루, 설탕, 우유, 계란",
  })
  @IsOptional()
  @IsString()
  ingredients?: string;

  @ApiPropertyOptional({
    description: "원산지",
    example: "국내산",
  })
  @IsOptional()
  @IsString()
  origin?: string;

  @ApiPropertyOptional({
    description: "고객 서비스 연락처",
    example: "1588-1234",
  })
  @IsOptional()
  @IsString()
  customerService?: string;

  @ApiProperty({
    description: "메인 카테고리",
    enum: MainCategory,
    example: MainCategory.CAKE,
  })
  @IsNotEmpty()
  @IsEnum(MainCategory)
  mainCategory: MainCategory;

  @ApiProperty({
    description: "인원 수 범위 (배열)",
    enum: SizeRange,
    isArray: true,
    example: [SizeRange.ONE_TO_TWO, SizeRange.TWO_TO_THREE],
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
    example: [DeliveryMethod.PICKUP, DeliveryMethod.DELIVERY],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(DeliveryMethod, { each: true })
  deliveryMethod: DeliveryMethod[];

  @ApiPropertyOptional({
    description: "해시태그 (배열)",
    isArray: true,
    example: ["케이크", "초콜릿", "생일", "기념일"],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];

  @ApiPropertyOptional({
    description: "상품 상태",
    enum: ProductStatus,
    example: ProductStatus.ACTIVE,
    default: ProductStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({
    description: "상품 이미지 URL 목록",
    isArray: true,
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
