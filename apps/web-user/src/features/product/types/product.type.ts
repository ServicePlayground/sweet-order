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

export enum SalesStatus {
  ENABLE = "ENABLE",
  DISABLE = "DISABLE",
}

export enum VisibilityStatus {
  ENABLE = "ENABLE",
  DISABLE = "DISABLE",
}

export enum LetteringRequired {
  REQUIRED = "REQUIRED",
  OPTIONAL = "OPTIONAL",
  DISABLED = "DISABLED",
}

export enum ImageUploadEnabled {
  ENABLE = "ENABLE",
  DISABLE = "DISABLE",
}

export enum VisibleStatus {
  ENABLE = "ENABLE",
  DISABLE = "DISABLE",
}

export interface CakeSizeOption {
  visible: VisibleStatus;
  description: string;
  displayName: string;
}

export interface CakeFlavorOption {
  visible: VisibleStatus;
  displayName: string;
}

/**
 * 상품 정보
 */
export interface Product {
  id: string;
  storeId: string;
  name: string;
  images: string[];
  salePrice: number;
  likeCount: number;
  salesStatus: SalesStatus;
  visibilityStatus: VisibilityStatus;
  cakeSizeOptions: CakeSizeOption[];
  cakeFlavorOptions: CakeFlavorOption[];
  letteringVisible: VisibleStatus;
  letteringRequired: LetteringRequired;
  letteringMaxLength: number;
  imageUploadEnabled: ImageUploadEnabled;
  detailDescription?: string;
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
  productNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductIsLiked {
  isLiked: boolean;
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
  data: Product[];
  meta: PaginationMeta;
}

/**
 * 상품 목록 조회 쿼리 키용 파라미터 (page 제외)
 */
export interface ProductListQueryParams {
  limit: number;
  sortBy: SortBy;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  storeId?: string;
}

/**
 * 상품 목록 조회 요청 파라미터
 */
export interface GetProductsParams extends ProductListQueryParams {
  page: number;
}
