/**
 * 정렬 enum
 */
export enum SortBy {
  LATEST = "latest", // 최신순(생성일 내림차순)
  PRICE_ASC = "price_asc", // 가격 오름차순
  PRICE_DESC = "price_desc", // 가격 내림차순
  POPULAR = "popular", // 인기순(좋아요 수 내림차순)
}

export enum MainCategory {
  PRODUCT = "product",
  SUPPLY = "supply",
  OTHER = "other",
}

export enum SizeRange {
  ONE_TO_TWO = "one_to_two",
  TWO_TO_THREE = "two_to_three",
  THREE_TO_FOUR = "three_to_four",
  FOUR_TO_FIVE = "four_to_five",
  FIVE_OR_MORE = "five_or_more",
}

export enum DeliveryMethod {
  PICKUP = "pickup",
  DELIVERY = "delivery",
}

/**
 * 상품 정보
 */
export interface Product {
  id: string;
  storeId: string;
  name: string;
  description?: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  notice?: string;
  caution?: string;
  basicIncluded?: string;
  location?: string;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
  orderFormSchema?: any;
  detailDescription?: string;
  productNumber: string;
  foodType: string;
  producer: string;
  manufactureDate: string;
  packageInfo: string;
  calories: string;
  ingredients: string;
  origin: string;
  customerService: string;
  mainCategory: string;
  sizeRange: string[];
  deliveryMethod: string[];
  hashtags: string[];
  images: string[];
  status: string;
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
  mainCategory?: MainCategory;
  sizeRange?: SizeRange[];
  deliveryMethod?: DeliveryMethod[];
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

