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
