export enum EnableStatus {
  ENABLE = "ENABLE", // 사용 (판매중/노출)
  DISABLE = "DISABLE", // 미사용 (판매중지/숨김)
}

export enum OptionRequired {
  REQUIRED = "REQUIRED", // 필수
  OPTIONAL = "OPTIONAL", // 선택
}

export enum ProductType {
  BASIC_CAKE = "BASIC_CAKE", // 기본 케이크
  CUSTOM_CAKE = "CUSTOM_CAKE", // 커스텀 케이크
}

/** 상품 카테고리 타입 (복수 선택 가능) */
export enum ProductCategoryType {
  BIRTHDAY = "BIRTHDAY", // 생일
  LOVER = "LOVER", // 연인
  FRIEND = "FRIEND", // 친구
  FAMILY = "FAMILY", // 가족
  ANNIVERSARY = "ANNIVERSARY", // 기념일
  SAME_DAY_PICKUP = "SAME_DAY_PICKUP", // 당일픽업
  LETTERING = "LETTERING", // 레터링
  CHARACTER = "CHARACTER", // 캐릭터
  SIMPLE = "SIMPLE", // 심플
  FLOWER = "FLOWER", // 꽃
  PHOTO = "PHOTO", // 사진
}

/**
 * 케이크 사이즈 표시명 enum
 */
export enum CakeSizeDisplayName {
  DOSIRAK = "도시락",
  MINI = "미니",
  SIZE_1 = "1호",
  SIZE_2 = "2호",
  SIZE_3 = "3호",
}

// 케이크 사이즈 옵션
export interface CakeSizeOption {
  id?: string;
  visible: EnableStatus;
  displayName: CakeSizeDisplayName;
  lengthCm: number;
  price: number;
  description: string;
}

// 케이크 맛 옵션
export interface CakeFlavorOption {
  id?: string;
  visible: EnableStatus;
  displayName: string;
  price: number;
}

export interface IProductForm {
  // 기본 정보
  images: string[]; // 첫 번째 요소가 대표 이미지 (필수)
  name: string;
  salePrice: number;
  salesStatus: EnableStatus;
  visibilityStatus: EnableStatus;
  productCategoryTypes?: ProductCategoryType[]; // 카테고리 (없거나 여러 개)
  searchTags?: string[]; // 검색 태그 (없거나 여러 개)

  // 케이크 옵션
  cakeSizeOptions?: CakeSizeOption[];
  cakeFlavorOptions?: CakeFlavorOption[];

  // 레터링 정책
  letteringVisible: EnableStatus;
  letteringRequired: OptionRequired;
  letteringMaxLength: number;
  imageUploadEnabled: EnableStatus;
  productType?: ProductType;

  // 상세정보
  detailDescription?: string;

  // 상품정보제공고시
  productNoticeFoodType: string;
  productNoticeProducer: string;
  productNoticeOrigin: string;
  productNoticeAddress: string;
  productNoticeManufactureDate: string;
  productNoticeExpirationDate: string;
  productNoticePackageCapacity: string;
  productNoticePackageQuantity: string;
  productNoticeIngredients: string;
  productNoticeCalories: string;
  productNoticeSafetyNotice: string;
  productNoticeGmoNotice: string;
  productNoticeImportNotice: string;
  productNoticeCustomerService: string;
}

// 상품 등록 요청
export interface ICreateProductRequest extends IProductForm {
  storeId: string;
}

// 상품 등록 응답
export interface ICreateProductResponse {
  id: string;
}

/**
 * 정렬 enum
 */
export enum SortBy {
  LATEST = "latest", // 최신순(생성일 내림차순)
  PRICE_ASC = "price_asc", // 가격 오름차순
  PRICE_DESC = "price_desc", // 가격 내림차순
  POPULAR = "popular", // 인기순(좋아요 수 내림차순)
  REVIEW_COUNT = "review_count", // 후기 많은 순(후기 수 내림차순)
  RATING_AVG = "rating_avg", // 별점 높은 순(평균 별점 내림차순)
}

/**
 * 상품 조회 파라미터 (목록 조회용)
 */
export interface IGetProductsListParams {
  page?: number;
  limit: number;
  sortBy: SortBy;
  storeId?: string;
  search?: string;
  salesStatus?: EnableStatus;
  visibilityStatus?: EnableStatus;
  minPrice?: number;
  maxPrice?: number;
  productCategoryTypes?: ProductCategoryType[];
}

/**
 * 상품 정보 (목록 조회용)
 */
export interface IProductItem extends ICreateProductRequest {
  id: string;
  likeCount: number;
  isLiked?: boolean | null; // 좋아요 여부 (로그인한 사용자의 경우에만 제공)
  averageRating: number; // 해당 상품의 모든 후기들의 평균 별점
  totalReviewCount: number; // 해당 상품의 모든 후기 개수
  createdAt: Date;
  updatedAt: Date;
  // 스토어 정보
  storeName: string;
  storeLogoImageUrl?: string | null;
  // 픽업장소 정보 (스토어 위치 정보)
  pickupAddress: string;
  pickupRoadAddress: string;
  pickupDetailAddress?: string;
  pickupZonecode: string;
  pickupLatitude: number;
  pickupLongitude: number;
}

/**
 * 페이지네이션 메타 정보
 */
export interface PaginationMeta {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * 상품 목록 응답
 */
export interface ProductListResponse {
  data: IProductItem[];
  meta: PaginationMeta;
}

/**
 * 상품 수정 요청 (모든 필드 optional)
 */
export interface IUpdateProductRequest {
  name?: string;
  images?: string[];
  salePrice?: number;
  salesStatus?: EnableStatus;
  visibilityStatus?: EnableStatus;
  cakeSizeOptions?: CakeSizeOption[];
  cakeFlavorOptions?: CakeFlavorOption[];
  letteringVisible?: EnableStatus;
  letteringRequired?: OptionRequired;
  letteringMaxLength?: number;
  imageUploadEnabled?: EnableStatus;
  productType?: ProductType;
  productCategoryTypes?: ProductCategoryType[];
  searchTags?: string[];
  detailDescription?: string;
  productNoticeFoodType?: string;
  productNoticeProducer?: string;
  productNoticeOrigin?: string;
  productNoticeAddress?: string;
  productNoticeManufactureDate?: string;
  productNoticeExpirationDate?: string;
  productNoticePackageCapacity?: string;
  productNoticePackageQuantity?: string;
  productNoticeIngredients?: string;
  productNoticeCalories?: string;
  productNoticeSafetyNotice?: string;
  productNoticeGmoNotice?: string;
  productNoticeImportNotice?: string;
  productNoticeCustomerService?: string;
}

/**
 * 상품 상세 정보 (조회용)
 */
export interface IProductDetail extends IProductItem {
  productNumber: string;
}
