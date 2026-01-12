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
  CAKE = "CAKE",
  SUPPLY = "SUPPLY",
  OTHER = "OTHER",
}

export enum SizeRange {
  ONE_TO_TWO = "ONE_TO_TWO",
  TWO_TO_THREE = "TWO_TO_THREE",
  THREE_TO_FOUR = "THREE_TO_FOUR",
  FOUR_TO_FIVE = "FOUR_TO_FIVE",
  FIVE_OR_MORE = "FIVE_OR_MORE",
}

export enum DeliveryMethod {
  PICKUP = "PICKUP",
  DELIVERY = "DELIVERY",
}

export enum ProductStatus {
  ACTIVE = "ACTIVE", // 판매중
  INACTIVE = "INACTIVE", // 판매중지(비공개)
  OUT_OF_STOCK = "OUT_OF_STOCK", // 품절
}

// 커스텀 주문양식 필드 타입
export type OrderFormFieldType = "selectbox" | "textbox";

// 커스텀 주문양식 옵션
export interface OrderFormOption {
  value: string;
  label: string;
  price?: number; // 추가 가격 (선택사항)
}

// 커스텀 주문양식 필드
export interface OrderFormField {
  id: string;
  type: OrderFormFieldType;
  label: string;
  required: boolean;
  placeholder?: string; // textbox용
  allowMultiple?: boolean; // selectbox용 - 중복선택허용
  options?: OrderFormOption[]; // selectbox용
}

// 커스텀 주문양식 스키마
export interface OrderFormSchema {
  fields: OrderFormField[];
}

// 커스텀 주문양식 데이터 타입
// orderFormSchema의 field.id를 키로 하고, string 또는 string[]을 값으로 가집니다.
export type OrderFormData = Record<string, string | string[]>;

// orderFormData를 표시용으로 변환하는 인터페이스
export interface OrderFormDisplayItem {
  fieldId: string;
  fieldLabel: string;
  displayValue: string;
  additionalPrice: number;
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
  orderFormSchema?: OrderFormSchema;
  detailDescription?: string;
  cancellationRefundDetailDescription?: string;
  productNumber: string;
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
  letteringRequired: string;
  mainCategory: string;
  sizeRange: string[];
  deliveryMethod: string[];
  hashtags: string[];
  mainImage: string;
  additionalImages: string[];
  status: string;
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
