export const BUSINESS_ERROR_MESSAGES = {
  BUSINESS_VALIDATION_FAILED: "사업자등록번호 진위확인에 실패했습니다.",
  BUSINESS_REGISTRATION_NUMBER_INVALID_FORMAT: "사업자등록번호는 하이픈 없는 10자리 숫자이며 유효한 번호여야 합니다.",
  OPENING_DATE_INVALID_FORMAT: "개업일자는 YYYYMMDD 형식의 유효한 날짜여야 합니다.",
} as const;

export const NTS_API_ERROR_MESSAGES = {
  HTTP_ERROR: "Http Error입니다.",
  INTERNAL_ERROR: "Internal Server Error입니다.",
  TOO_LARGE_REQUEST: "요청 사업자번호 또는 정보 100개 초과입니다.",
  REQUEST_DATA_MALFORMED: "필수 요청 파라미터 누락되었습니다.",
  BAD_JSON_REQUEST: "	JSON 포맷에 적합하지 않는 요청입니다.",
  BUSINESS_STATUS_INACTIVE: "휴업 또는 폐업 상태입니다.",
} as const;

export const BUSINESS_SUCCESS_MESSAGES = {
  BUSINESS_VALIDATION_SUCCESS: "사업자등록번호 진위확인이 완료되었습니다.",
} as const;

export enum B_STT_CD {
  ACTIVE = "01", // 계속사업자
  INACTIVE = "02", // 휴업자
  CLOSED = "03", // 폐업자
}

export enum B_STT {
  ACTIVE = "계속사업자", // 계속사업자
  INACTIVE = "휴업자", // 휴업자
  CLOSED = "폐업자", // 폐업자
}

export enum TAX_TYPE_CD {
  GENERAL = "01", // 부가가치세 일반과세자
  REDUCED = "02", // 부가가치세 간이과세자
  SPECIAL = "03", // 부가가치세 과세특례자
  EXEMPT = "04", // 부가가치세 면세사업자
  NON_PROFIT = "05", // 수익사업을 영위하지 않는 비영리법인이거나 고유번호가 부여된 단체,국가기관 등
  ORGANIZATION = "06", // 고유번호가 부여된 단체
  INVOICE = "07", // 부가가치세 간이과세자(세금계산서 발급사업자)
}

export enum TAX_TYPE {
  GENERAL = "부가가치세 일반과세자", // 부가가치세 일반과세자
  REDUCED = "부가가치세 간이과세자", // 부가가치세 간이과세자
  SPECIAL = "부가가치세 과세특례자", // 부가가치세 과세특례자
  EXEMPT = "부가가치세 면세사업자", // 부가가치세 면세사업자
  NON_PROFIT = "수익사업을 영위하지 않는 비영리법인이거나 고유번호가 부여된 단체,국가기관 등", // 수익사업을 영위하지 않는 비영리법인이거나 고유번호가 부여된 단체,국가기관 등
  ORGANIZATION = "고유번호가 부여된 단체", // 고유번호가 부여된 단체
  INVOICE = "부가가치세 간이과세자(세금계산서 발급사업자)", // 부가가치세 간이과세자(세금계산서 발급사업자)
}

export enum RBF_TAX_TYPE_CD {  
  GENERAL = "01", // 부가가치세 일반과세자
  REDUCED = "02", // 부가가치세 간이과세자
  INVOICE = "07", // 부가가치세 간이과세자(세금계산서 발급사업자)
  NONE = "99", // 해당없음
}

export enum RBF_TAX_TYPE {
  GENERAL = "부가가치세 일반과세자", // 부가가치세 일반과세자
  REDUCED = "부가가치세 간이과세자", // 부가가치세 간이과세자
  INVOICE = "부가가치세 간이과세자(세금계산서 발급사업자)", // 부가가치세 간이과세자(세금계산서 발급사업자)
  NONE = "해당없음", // 해당없음
}

/**
 * Swagger 예시 데이터
 * 실제 API 응답과 일치하는 예시 데이터를 제공합니다.
 */
export const SWAGGER_EXAMPLES = {
  B_NO: "1234567891", // 사업자등록번호
  P_NM: "홍길동", // 대표자명
  START_DT: "20230101", // 개업일자
  B_NM: "스위트오더", // 상호명
  B_SECTOR: "도매 및 소매업", // 업태명
  B_TYPE: "전자상거래 소매 중개업", // 종목명
  B_ADR: "사업장 주소", // 사업장 주소
  B_STT: B_STT.ACTIVE, // 납세자상태
  B_STT_CD: B_STT_CD.ACTIVE, // 납세자상태 코드
  TAX_TYPE: TAX_TYPE.GENERAL, // 과세 유형
  TAX_TYPE_CD: TAX_TYPE_CD.GENERAL, // 과세 유형 코드
  END_DT: "20230101", // 폐업일
  UTCC_YN: "N", // 단위과세전환폐업여부 (Y,N)
  TAX_TYPE_CHANGE_DT: "20230101", // 최근과세유형전환일자
  INVOICE_APPLY_DT: "20230101", // 세금계산서적용일자
  RBF_TAX_TYPE: RBF_TAX_TYPE.NONE, // 직전과세유형
  RBF_TAX_TYPE_CD: RBF_TAX_TYPE_CD.NONE, // 직전과세유형 코드
} as const;

/**
 * Swagger 응답 예시 데이터
 * 복합 응답 구조를 위한 예시 데이터를 제공합니다.
 */
export const SWAGGER_RESPONSE_EXAMPLES = {
  BUSINESS_VALIDATION_RESPONSE: {
    request: {
      b_no: SWAGGER_EXAMPLES.B_NO,
      start_dt: SWAGGER_EXAMPLES.START_DT,
      p_nm: SWAGGER_EXAMPLES.P_NM,
      b_nm: SWAGGER_EXAMPLES.B_NM,
      b_sector: SWAGGER_EXAMPLES.B_SECTOR,
      b_type: SWAGGER_EXAMPLES.B_TYPE,
    },
    response: {
      b_no: SWAGGER_EXAMPLES.B_NO,
      b_stt: SWAGGER_EXAMPLES.B_STT,
      b_stt_cd: SWAGGER_EXAMPLES.B_STT_CD,
      tax_type: SWAGGER_EXAMPLES.TAX_TYPE,
      tax_type_cd: SWAGGER_EXAMPLES.TAX_TYPE_CD,
      end_dt: SWAGGER_EXAMPLES.END_DT,
      utcc_yn: SWAGGER_EXAMPLES.UTCC_YN,
      tax_type_change_dt: SWAGGER_EXAMPLES.TAX_TYPE_CHANGE_DT,
      invoice_apply_dt: SWAGGER_EXAMPLES.INVOICE_APPLY_DT,
      rbf_tax_type: SWAGGER_EXAMPLES.RBF_TAX_TYPE,
      rbf_tax_type_cd: SWAGGER_EXAMPLES.RBF_TAX_TYPE_CD,
    },
  },
} as const;

export const SWAGGER_DESCRIPTIONS = {
  B_NO: "사업자등록번호 (10자리 숫자, 하이픈 제거)",
  P_NM: "대표자명 (외국인 사업자의 경우에는 영문명 입력)",
  START_DT: "개업일자 (YYYYMMDD 형식, 하이픈 제거)",
  B_NM: `상호 (1) 상호가 주식회사인 경우, 아래의 단어에 대해서는 상호의 맨 앞 또는 맨 뒤에 붙어도 동일하게 검색 가능 - (주) - 주식회사 - （주）--> 'ㄴ' 으로 한자키 입력을 통한 특수문자 괄호 2) 앞뒤 공백(empty space) 무시하고 검색))`,
  B_SECTOR: `업태명: (1) 모든 공백(앞뒤 포함)에 대해 무시하고 검색됨 예) '서 비 스' -> '서비스' 로 검색됨)`,
  B_TYPE: "종목명 (1) 모든 공백(앞뒤 포함)에 대해 무시하고 검색됨 (주업태명과 동일))",
  B_ADR: "사업장 주소 (모든 공백(앞뒤 포함)에 대해 무시하고 검색됨 (예시: 서울특별시 강남구, 경기도 부천시))",
} as const;