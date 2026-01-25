import {
  IBusinessRegistrationForm,
  IOnlineTradingCompanyDetailRequest,
} from "@/apps/web-seller/features/business/types/business.type";

// 스토어 정보 폼
export interface IStoreForm {
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

// 스토어 목록 아이템
export interface IStoreListItem {
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
