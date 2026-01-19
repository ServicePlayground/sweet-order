export enum EnableStatus {
  ENABLE = "ENABLE", // 사용 (판매중/노출)
  DISABLE = "DISABLE", // 미사용 (판매중지/숨김)
}

export enum OptionRequired {
  REQUIRED = "REQUIRED", // 필수
  OPTIONAL = "OPTIONAL", // 선택
}

// 케이크 사이즈 옵션
export interface CakeSizeOption {
  visible: EnableStatus;
  displayName: string;
  description: string;
}

// 케이크 맛 옵션
export interface CakeFlavorOption {
  visible: EnableStatus;
  displayName: string;
}

export interface IProductForm {
  // 기본 정보
  images: string[]; // 첫 번째 요소가 대표 이미지 (필수)
  name: string;
  salePrice: number;
  salesStatus: EnableStatus;
  visibilityStatus: EnableStatus;

  // 케이크 옵션
  cakeSizeOptions?: CakeSizeOption[];
  cakeFlavorOptions?: CakeFlavorOption[];

  // 레터링 정책
  letteringVisible: EnableStatus;
  letteringRequired: OptionRequired;
  letteringMaxLength: number;
  imageUploadEnabled: EnableStatus;

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
}

/**
 * 상품 정보 (목록 조회용)
 */
export interface IProductItem extends ICreateProductRequest {
  id: string;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
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
