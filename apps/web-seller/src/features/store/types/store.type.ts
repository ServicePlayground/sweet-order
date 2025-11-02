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
