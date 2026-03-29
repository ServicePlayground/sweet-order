import type { ProductCategoryType } from "@/apps/web-user/features/product/types/product.type";

/** 영업 캘린더 (백엔드 StoreBusinessCalendarDto와 동일) */
export interface StoreBusinessDayOverride {
  date: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

export interface StoreBusinessCalendar {
  weeklyClosedWeekdays: number[];
  standardOpenTime: string;
  standardCloseTime: string;
  dayOverrides: StoreBusinessDayOverride[];
}

export interface StoreListResponse {
  data: StoreInfo[];
  meta: {
    currentPage: number;
    hasNext: boolean;
    totalCount: number;
  };
}

/** 스토어 목록 필터 */
export interface StoreListFilter {
  /** 케이크 사이즈 표시명: 도시락, 미니, 1호, 2호, 3호 */
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  productCategoryTypes?: ProductCategoryType[];
}

/** 스토어 목록 조회 API 요청 파라미터 */
export interface StoreListParams extends StoreListFilter {
  page: number;
  limit: number;
  search?: string;
}

export interface StoreInfo {
  id: string;
  userId: string;
  logoImageUrl?: string;
  name: string;
  description?: string;
  isLiked: boolean | null;
  // 사업자 정보
  businessNo: string;
  representativeName: string;
  openingDate: string;
  businessName: string;
  businessSector: string;
  businessType: string;
  // 통신판매사업자 정보
  permissionManagementNumber: string;
  // 주소/위치 정보
  address: string;
  roadAddress: string;
  detailAddress: string;
  zonecode: string;
  latitude: number;
  longitude: number;
  // 시스템 필드
  likeCount: number;
  // 후기 통계
  averageRating: number; // 해당 스토어의 모든 상품 후기들의 평균 별점
  totalReviewCount: number; // 해당 스토어의 모든 상품 후기 개수
  // 상품 대표이미지 (상품당 1장)
  productRepresentativeImageUrls: string[];
  // 상품 중 최소 금액 (노출·판매중인 상품만, 없으면 null)
  minProductPrice: number | null;
  /** 영업 캘린더 (스토어 목록·상세 API) */
  businessCalendar?: StoreBusinessCalendar;
  createdAt: Date;
  updatedAt: Date;
}
