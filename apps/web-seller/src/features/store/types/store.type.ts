import {
  IBusinessRegistrationForm,
  IOnlineTradingCompanyDetailRequest,
} from "@/apps/web-seller/features/business/types/business.type";

// 주소 정보
export interface IStoreAddress {
  address: string; // 지번 주소
  roadAddress: string; // 도로명 주소
  zonecode: string; // 우편번호
  latitude: number; // 위도
  longitude: number; // 경도
}

// 스토어 정보 폼
export interface IStoreForm extends IStoreAddress {
  name: string;
  description?: string;
  logoImageUrl?: string;
}

// 스토어 생성 요청
export interface ICreateStoreRequest extends IStoreForm {
  businessValidation: IBusinessRegistrationForm;
  onlineTradingCompanyDetail: IOnlineTradingCompanyDetailRequest;
}

// 스토어 생성 응답
export interface ICreateStoreResponse {
  id: string;
}

// 스토어 수정 요청
export interface IUpdateStoreRequest extends IStoreForm {}

/**
 * 스토어 목록 조회 쿼리 키용 파라미터 (page 제외)
 */
export interface IGetStoresParams {
  limit: number;
}

/**
 * 스토어 목록 조회 요청 파라미터
 */
export interface IGetStoresRequest extends IGetStoresParams {
  page: number;
}

// 스토어 목록 아이템
export interface IStoreListItem extends IStoreAddress {
  id: string;
  userId: string;
  logoImageUrl?: string;
  name: string;
  description?: string;
  // 사업자 정보
  businessNo: string;
  representativeName: string;
  openingDate: string;
  businessName: string;
  businessSector: string;
  businessType: string;
  // 통신판매사업자 정보
  permissionManagementNumber: string;
  // 시스템 필드
  likeCount: number;
  // 후기 통계
  averageRating: number; // 해당 스토어의 모든 상품 후기들의 평균 별점
  totalReviewCount: number; // 해당 스토어의 모든 상품 후기 개수
  createdAt: Date;
  updatedAt: Date;
}

// 스토어 상세 정보 (조회용)
export interface IStoreDetail extends IStoreAddress {
  id: string;
  userId: string;
  logoImageUrl?: string;
  name: string;
  description?: string;
  // 사업자 정보
  businessNo: string;
  representativeName: string;
  openingDate: string;
  businessName: string;
  businessSector: string;
  businessType: string;
  // 통신판매사업자 정보
  permissionManagementNumber: string;
  // 시스템 필드
  likeCount: number;
  // 후기 통계
  averageRating: number;
  totalReviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 스토어 목록 응답
 */
export interface IStoreListResponse {
  data: IStoreListItem[];
  meta: import("@/apps/web-seller/common/types/api.type").PaginationMeta;
}
