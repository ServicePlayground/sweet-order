import type {
  BusinessValidationRequestDto,
  OnlineTradingCompanyDetailRequestDto,
} from "@/apps/web-seller/features/business/types/business.dto";

/** UI: 1단계 사업자등록 폼 값 (컴포넌트명과 구분) */
export type BusinessRegistrationFormValues = BusinessValidationRequestDto;

/** UI: 2단계 통신판매사업자 신고번호 폼 값 (컴포넌트명과 구분) */
export type OnlineTradingCompanyDetailFormValues = Pick<
  OnlineTradingCompanyDetailRequestDto,
  "prmmiMnno"
>;
