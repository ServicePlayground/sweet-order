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
  name: string;
  description?: string;
  logoImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
