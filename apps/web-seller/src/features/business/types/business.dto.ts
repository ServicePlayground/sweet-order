/**
 * 사업자/통신판매 API 타입 (백엔드 business DTO와 1:1 정합)
 * - 사업자등록 진위: BusinessValidationRequestDto
 * - 통신판매 등록상세: OnlineTradingCompanyDetailRequestDto
 */

/** 사업자등록번호 진위확인 요청 (1단계) */
export interface BusinessValidationRequestDto {
  b_no: string;
  p_nm: string;
  start_dt: string;
  b_nm: string;
  b_sector: string;
  b_type: string;
}

/** 통신판매사업자 등록상세 조회 요청 (2단계) */
export interface OnlineTradingCompanyDetailRequestDto {
  prmmiMnno: string;
  brno: string;
}
