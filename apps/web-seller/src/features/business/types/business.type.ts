export type B_STT_CD = "01" | "02" | "03";
export type B_STT = "계속사업자" | "휴업자" | "폐업자";
export type TAX_TYPE_CD = "01" | "02" | "03" | "04" | "05" | "06" | "07";
export type TAX_TYPE =
  | "부가가치세 일반과세자"
  | "부가가치세 간이과세자"
  | "부가가치세 과세특례자"
  | "부가가치세 면세사업자"
  | "수익사업을 영위하지 않는 비영리법인이거나 고유번호가 부여된 단체,국가기관 등"
  | "고유번호가 부여된 단체"
  | "부가가치세 간이과세자(세금계산서 발급사업자)";
export type RBF_TAX_TYPE_CD = "01" | "02" | "07" | "99";
export type RBF_TAX_TYPE =
  | "부가가치세 일반과세자"
  | "부가가치세 간이과세자"
  | "부가가치세 간이과세자(세금계산서 발급사업자)"
  | "해당없음";

export interface IBusinessRegistrationForm {
  b_no: string;
  p_nm: string;
  start_dt: string;
  b_nm: string;
  b_sector: string;
  b_type: string;
}

export interface IBusinessRegistrationResponse {
  request: {
    b_no: string; // 사업자등록번호
    start_dt: string; // 개업일자
    p_nm: string; // 대표자성명1
    b_nm: string; // 상호명
    b_sector: string; // 업태명
    b_type: string; // 종목명
  };
  response: {
    b_no: string; // 사업자등록번호
    b_stt: B_STT; // 납세자상태
    b_stt_cd: B_STT_CD; // 납세자상태 코드
    tax_type: TAX_TYPE; // 과세 유형
    tax_type_cd: TAX_TYPE_CD; // 과세 유형 코드
    end_dt: string; // 폐업일
    utcc_yn: "Y" | "N"; // 단위과세전환폐업여부 (Y,N)
    tax_type_change_dt: string; // 최근과세유형전환일자
    invoice_apply_dt: string; // 세금계산서적용일자
    rbf_tax_type: RBF_TAX_TYPE; // 직전과세유형
    rbf_tax_type_cd: RBF_TAX_TYPE_CD; // 직전과세유형 코드
  };
}

export interface IOnlineTradingCompanyDetailForm {
  prmmiMnno: string; // 인허가관리번호(통신판매사업자 신고번호)
}

export interface IOnlineTradingCompanyDetailRequest extends IOnlineTradingCompanyDetailForm {
  brno: string; // 사업자등록번호
}

export interface IOnlineTradingCompanyDetailResponse {
  opnSn: string; // 일련번호
  prmmiYr: string; // 인허가연도
  prmmiMnno: string; // 인허가관리번호(통신판매사업자 신고번호)
  ctpvNm: string; // 시도명
  dclrInstNm: string; // 통신판매사업자 등록기관지역명
  operSttusCdNm: string; // 운영상태 코드명
  smtxTrgtYnCn: string; // 간이과세대상자여부내용
  corpYnNm: string; // 법인여부명
  bzmnNm: string; // 법인명
  bzmnRgsSttusSeNm: string; // 법인등록상태
  crno: string; // 법인등록번호
  brno: string; // 사업자등록번호
  telno: string; // 전화번호
  fxno: string; // 팩스번호
  lctnRnAddr: string; // 소재지 도로명주소
  lctnAddr: string; // 소재지 주소
  domnCn: string; // 도메인명
  opnServerPlaceAladr: string; // 호스트서버주소
  ntslMthdNm: string; // 판매방식명(01: 화상, 02: 인터넷, 03: 화상+인터넷, 04: 화상+팩스, 05: 인터넷+팩스, 06: 화상+인터넷+팩스)
  ntslMthdCn: string; // 판매방식명
  trtmntPrdlstNm: string; // 취금품목
  ntslPrdlstCn: string; // 취금품목설명
  dclrCn: string | null; // 신고내용
  chgCn: string; // 변경내용
  chgRsnCn: string; // 변경사유내용
  tcbizBgngDate: string; // 휴업시작일자
  tcbizEndDate: string; // 휴업종료일자
  clsbizDate: string; // 폐업일자
  bsnResmptDate: string; // 영업재개일자
  spcssRsnCn: string; // 휴폐업사유
  dclrDate: string; // 신고일자
  lctnRnOzip: string; // 도로명_우편번호
  rnAddr: string; // 도로명 주소
  opnMdfcnDt: string; // 최종수정시점
  prcsDeptDtlNm: string; // 처리부서 상세명
  prcsDeptAreaNm: string; // 처리부서 지역명
  prcsDeptNm: string; // 처리부서 명
  chrgDeptTelno: string; // 담당부서 전화번호
  rprsvNm: string; // 대표자명
  rprsvEmladr: string; // 대표자 이메일주소
}
