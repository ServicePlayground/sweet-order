import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  OptionRequired,
  EnableStatus,
  ProductType,
  CakeSizeDisplayName,
  SWAGGER_EXAMPLES,
} from "@apps/backend/modules/product/constants/product.constants";
import { SWAGGER_EXAMPLES as STORE_SWAGGER_EXAMPLES } from "@apps/backend/modules/store/constants/store.constants";

/**
 * 케이크 사이즈 옵션 응답 DTO
 */
export class CakeSizeOptionResponseDto {
  @ApiProperty({
    description: "옵션 고유 ID",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.cakeSizeOptions[0].id,
  })
  id: string;

  @ApiProperty({
    description: "노출 여부",
    enum: EnableStatus,
    example: EnableStatus.ENABLE,
  })
  visible: EnableStatus;

  @ApiProperty({
    description: "표시명",
    enum: CakeSizeDisplayName,
    example: CakeSizeDisplayName.MINI,
  })
  displayName: CakeSizeDisplayName;

  @ApiProperty({
    description: "케이크 지름/길이 (cm 단위)",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.cakeSizeOptions[0].lengthCm,
  })
  lengthCm: number;

  @ApiProperty({
    description: "설명",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.cakeSizeOptions[0].description,
  })
  description: string;

  @ApiProperty({
    description: "해당 사이즈의 가격",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.cakeSizeOptions[0].price,
  })
  price: number;
}

/**
 * 케이크 맛 옵션 응답 DTO
 */
export class CakeFlavorOptionResponseDto {
  @ApiProperty({
    description: "옵션 고유 ID",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.cakeFlavorOptions[0].id,
  })
  id: string;

  @ApiProperty({
    description: "노출 여부",
    enum: EnableStatus,
    example: EnableStatus.ENABLE,
  })
  visible: EnableStatus;

  @ApiProperty({
    description: "표시명",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.cakeFlavorOptions[0].displayName,
  })
  displayName: string;

  @ApiProperty({
    description: "해당 맛 옵션의 추가 가격",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.cakeFlavorOptions[0].price,
  })
  price: number;
}

/**
 * 상품 응답 DTO
 */
export class ProductResponseDto {
  @ApiProperty({
    description: "상품 ID",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.id,
  })
  id: string;

  @ApiProperty({
    description: "스토어 ID",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.storeId,
  })
  storeId: string;

  @ApiProperty({
    description: "상품명",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.name,
  })
  name: string;

  @ApiProperty({
    description: "이미지 URL 목록 (첫 번째 요소가 대표 이미지)",
    type: [String],
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.images,
  })
  images: string[];

  @ApiProperty({
    description: "판매가",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.salePrice,
  })
  salePrice: number;

  @ApiProperty({
    description: "판매여부",
    enum: EnableStatus,
    example: EnableStatus.ENABLE,
  })
  salesStatus: EnableStatus;

  @ApiProperty({
    description: "노출여부",
    enum: EnableStatus,
    example: EnableStatus.ENABLE,
  })
  visibilityStatus: EnableStatus;

  @ApiPropertyOptional({
    description: "케이크 옵션 - 사이즈 목록",
    type: [CakeSizeOptionResponseDto],
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.cakeSizeOptions,
  })
  cakeSizeOptions?: CakeSizeOptionResponseDto[] | null;

  @ApiPropertyOptional({
    description: "케이크 옵션 - 맛 목록",
    type: [CakeFlavorOptionResponseDto],
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.cakeFlavorOptions,
  })
  cakeFlavorOptions?: CakeFlavorOptionResponseDto[] | null;

  @ApiProperty({
    description: "레터링 문구 사용 여부",
    enum: EnableStatus,
    example: EnableStatus.ENABLE,
  })
  letteringVisible: EnableStatus;

  @ApiProperty({
    description: "레터링 문구 사용 (필수/선택)",
    enum: OptionRequired,
    example: OptionRequired.OPTIONAL,
  })
  letteringRequired: OptionRequired;

  @ApiProperty({
    description: "레터링 최대 글자 수",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.letteringMaxLength,
  })
  letteringMaxLength: number;

  @ApiProperty({
    description: "이미지 등록 사용여부",
    enum: EnableStatus,
    example: EnableStatus.ENABLE,
  })
  imageUploadEnabled: EnableStatus;

  @ApiProperty({
    description: "상품 타입",
    enum: ProductType,
    example: ProductType.CUSTOM_CAKE,
  })
  productType: ProductType;

  @ApiPropertyOptional({
    description: "상세 설명 (HTML)",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.detailDescription,
  })
  detailDescription?: string | null;

  @ApiProperty({
    description: "상품번호",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.productNumber,
  })
  productNumber: string;

  @ApiProperty({
    description: "식품의 유형",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeFoodType,
  })
  productNoticeFoodType: string;

  @ApiProperty({
    description: "제조사",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeProducer,
  })
  productNoticeProducer: string;

  @ApiProperty({
    description: "원산지",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeOrigin,
  })
  productNoticeOrigin: string;

  @ApiProperty({
    description: "소재지",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeAddress,
  })
  productNoticeAddress: string;

  @ApiProperty({
    description: "제조연월일",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeManufactureDate,
  })
  productNoticeManufactureDate: string;

  @ApiProperty({
    description: "소비기한 또는 품질유지기한",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeExpirationDate,
  })
  productNoticeExpirationDate: string;

  @ApiProperty({
    description: "포장단위별 용량/수량",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticePackageCapacity,
  })
  productNoticePackageCapacity: string;

  @ApiProperty({
    description: "포장 단위별 수량",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticePackageQuantity,
  })
  productNoticePackageQuantity: string;

  @ApiProperty({
    description: "원재료명 및 함량",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeIngredients,
  })
  productNoticeIngredients: string;

  @ApiProperty({
    description: "영양성분",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeCalories,
  })
  productNoticeCalories: string;

  @ApiProperty({
    description: "소비자안전을 위한 주의사항",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeSafetyNotice,
  })
  productNoticeSafetyNotice: string;

  @ApiProperty({
    description: "유전자변형식품에 해당하는 경우의 표시",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeGmoNotice,
  })
  productNoticeGmoNotice: string;

  @ApiProperty({
    description: "수입식품의 경우",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeImportNotice,
  })
  productNoticeImportNotice: string;

  @ApiProperty({
    description: "고객센터",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.productNoticeCustomerService,
  })
  productNoticeCustomerService: string;

  @ApiProperty({
    description: "좋아요 수",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.likeCount,
  })
  likeCount: number;

  @ApiProperty({
    description: "생성일시",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.createdAt,
  })
  createdAt: Date;

  @ApiProperty({
    description: "수정일시",
    example: SWAGGER_EXAMPLES.PRODUCT_DATA.updatedAt,
  })
  updatedAt: Date;

  // 픽업장소 정보 (스토어 위치 정보)
  @ApiProperty({
    description: "픽업장소 - 지번 주소",
    example: STORE_SWAGGER_EXAMPLES.ADDRESS,
  })
  pickupAddress: string;

  @ApiProperty({
    description: "픽업장소 - 도로명 주소",
    example: STORE_SWAGGER_EXAMPLES.ROAD_ADDRESS,
  })
  pickupRoadAddress: string;

  @ApiProperty({
    description: "픽업장소 - 우편번호",
    example: STORE_SWAGGER_EXAMPLES.ZONECODE,
  })
  pickupZonecode: string;

  @ApiProperty({
    description: "픽업장소 - 위도",
    example: STORE_SWAGGER_EXAMPLES.LATITUDE,
  })
  pickupLatitude: number;

  @ApiProperty({
    description: "픽업장소 - 경도",
    example: STORE_SWAGGER_EXAMPLES.LONGITUDE,
  })
  pickupLongitude: number;
}

/**
 * 페이지네이션 메타 정보 응답 DTO
 */
export class PaginationMetaResponseDto {
  @ApiProperty({
    description: "현재 페이지 번호",
    example: SWAGGER_EXAMPLES.PAGINATION_META.currentPage,
  })
  currentPage: number;

  @ApiProperty({
    description: "페이지당 항목 수",
    example: SWAGGER_EXAMPLES.PAGINATION_META.limit,
  })
  limit: number;

  @ApiProperty({
    description: "전체 항목 수",
    example: SWAGGER_EXAMPLES.PAGINATION_META.totalItems,
  })
  totalItems: number;

  @ApiProperty({
    description: "전체 페이지 수",
    example: SWAGGER_EXAMPLES.PAGINATION_META.totalPages,
  })
  totalPages: number;

  @ApiProperty({
    description: "다음 페이지 존재 여부",
    example: SWAGGER_EXAMPLES.PAGINATION_META.hasNext,
  })
  hasNext: boolean;

  @ApiProperty({
    description: "이전 페이지 존재 여부",
    example: SWAGGER_EXAMPLES.PAGINATION_META.hasPrev,
  })
  hasPrev: boolean;
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
