export const BUSINESS_ERROR_MESSAGES = {
  BUSINESS_VALIDATION_FAILED: "사업자등록번호 진위확인에 실패했습니다.",
  BUSINESS_REGISTRATION_NUMBER_INVALID_FORMAT:
    "사업자등록번호는 하이픈 없는 10자리 숫자이며 유효한 번호여야 합니다.",
  OPENING_DATE_INVALID_FORMAT: "개업일자는 YYYYMMDD 형식의 유효한 날짜여야 합니다.",
  PERMISSION_MANAGEMENT_NUMBER_INVALID_FORMAT:
    "인허가관리번호는 YYYY-한글지역명-숫자4자리 형식이어야 합니다. (예: 2021-서울강동-0422)"
} as const;

export const NTS_API_ERROR_MESSAGES = {
  HTTP_ERROR: "Http Error입니다.",
  INTERNAL_ERROR: "Internal Server Error입니다.",
  TOO_LARGE_REQUEST: "요청 사업자번호 또는 정보 100개 초과입니다.",
  REQUEST_DATA_MALFORMED: "필수 요청 파라미터 누락되었습니다.",
  BAD_JSON_REQUEST: "	JSON 포맷에 적합하지 않는 요청입니다.",
  BUSINESS_STATUS_INACTIVE: "휴업 또는 폐업 상태입니다.",
} as const;

export const KFTC_API_ERROR_MESSAGES = {
  "00": "정상 처리되었습니다.",
  "01": "어플리케이션 에러입니다.",
  "02": "데이터베이스 에러입니다.",
  "03": "데이터없음 에러입니다.",
  "04": "HTTP 에러입니다.",
  "05": "서비스 연결 실패 에러입니다.",
  "10": "잘못된 요청 파라미터 에러입니다.",
  "11": "필수 요청 파라미터가 누락되었습니다.",
  "12": "해당 오픈API 서비스가 없거나 폐지되었습니다.",
  "20": "서비스 접근거부입니다.",
  "21": "일시적으로 사용할 수 없는 서비스 키입니다.",
  "22": "서비스 요청제한 횟수를 초과했습니다.",
  "30": "등록되지 않은 서비스키입니다.",
  "31": "기한이 만료된 서비스키입니다.",
  "32": "등록되지 않은 IP주소입니다.",
  "33": "서명되지 않은 호출입니다.",
  HTTP_ERROR: "Http Error입니다.",
  INTERNAL_ERROR: "Internal Server Error입니다.",
  OPERATION_STATUS_NOT_NORMAL: "통신판매사업자의 운영상태가 정상영업이 아닙니다.",
  ONLINE_TRADING_COMPANY_DETAIL_NOT_FOUND: "통신판매사업자 등록 정보가 존재하지 않습니다.",
} as const;

export const BUSINESS_SUCCESS_MESSAGES = {
  BUSINESS_VALIDATION_SUCCESS: "사업자등록번호 진위확인이 완료되었습니다.",
  ONLINE_TRADING_COMPANY_DETAIL_SUCCESS: "통신판매사업자 등록상세 조회가 완료되었습니다.",
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
  /* 사업자등록 예시 */
  B_NO: "1198288946", // 사업자등록번호
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

  /* 통신판매사업자 예시 */
  PRMMI_MNNO: "2021-서울강동-0422", // 인허가관리번호(통신판매사업자 신고번호)
  OPN_SN: "878675976369799584", // 일련번호
  PRMMI_YR: "2021", // 인허가연도
  CTPV_NM: "서울특별시", // 시도명
  DCLR_INST_NM: "서울특별시 강동구", // 통신판매사업자 등록기관지역명
  OPER_STTUS_CD_NM: "정상영업", // 운영상태 코드명
  SMTX_TRGT_YNCN: "비대상", // 간이과세대상자여부내용
  CORP_YN_NM: "법인", // 법인여부명
  BZMN_NM: "서울장애인종합복지관보호작업장", // 법인명
  CRNO: "1101111111111", // 법인등록번호
  BZMN_RGS_STTUS_SE_NM: "계속사업자", // 법인등록상태
  BRNO: "1198288946", // 사업자등록번호
  TELNO: "024405880", // 전화번호
  FXNO: "N/A", // 팩스번호
  LCTN_RN_ADDR: "서울특별시 강동구 고덕로", // 소재지 도로명주소
  LCTN_ADDR: "서울특별시 강동구 고덕동 317 번지24 호 산 1 시립서울장애인종합복지관", // 소재지 주소
  DOMN_CN: "smartstore.naver.com/paniskuki", // 도메인명
  OPN_SERVER_PLACE_ALADDR: "N/A", // 호스트서버주소
  NTSL_MTHD_NM: "02", // 판매방식명(01: 화상, 02: 인터넷, 03: 화상+인터넷, 04: 화상+팩스, 05: 인터넷+팩스, 06: 화상+인터넷+팩스)
  NTSL_MTHD_CN: "인터넷", // 판매방식명
  TRTMNT_PRDLST_NM: "08", // 취금품목
  NTSL_PRDLST_CN: "건강/식품", // 취금품목설명
  DCLR_CN: null, // 신고내용
  CHG_CN: "N/A", // 변경내용
  CHG_RSN_CN: "N/A", // 변경사유내용
  TCBIZ_BGNG_DATE: "N/A", // 휴업시작일자
  TCBIZ_END_DATE: "N/A", // 휴업종료일자
  CLSBIZ_DATE: "N/A", // 폐업일자
  BSN_RESMPT_DATE: "N/A", // 영업재개일자
  SPCSS_RSN_CN: "N/A", // 휴폐업사유
  DCLR_DATE: "20210201", // 신고일자
  LCTN_RN_OZIP: "05235", // 도로명_우편번호
  RN_ADDR: "서울특별시 강동구 고덕로", // 도로명 주소
  OPN_MDFCN_DT: "20210201000000", // 최종수정시점
  PRCS_DEPT_DTL_NM: "서울특별시 강동구 기획경제국 일자리창출과", // 처리부서 상세명
  PRCS_DEPT_AREA_NM: "서울특별시 강동구", // 처리부서 지역명
  PRCS_DEPT_NM: "일자리창출과", // 처리부서 명
  CHRG_DEPT_TELNO: "02-480-1300", // 담당부서 전화번호
  RPRSV_NM: "김희정", // 대표자명
  RPRSV_EMLADR: "paniskuki2@naver.com", // 대표자 이메일주소
} as const;

/**
 * Swagger 응답 예시 데이터
 * 복합 응답 구조를 위한 예시 데이터를 제공합니다.
 */
export const SWAGGER_RESPONSE_EXAMPLES = {
  /* 사업자등록 응답 예시 */
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

  /* 통신판매사업자 등록상세 조회 응답 예시 */
  ONLINE_TRADING_COMPANY_DETAIL_RESPONSE: {
    opnSn: SWAGGER_EXAMPLES.OPN_SN,
    prmmiYr: SWAGGER_EXAMPLES.PRMMI_YR,
    prmmiMnno: SWAGGER_EXAMPLES.PRMMI_MNNO,
    ctpvNm: SWAGGER_EXAMPLES.CTPV_NM,
    dclrInstNm: SWAGGER_EXAMPLES.DCLR_INST_NM,
    operSttusCdNm: SWAGGER_EXAMPLES.OPER_STTUS_CD_NM,
    smtxTrgtYnCn: SWAGGER_EXAMPLES.SMTX_TRGT_YNCN,
    corpYnNm: SWAGGER_EXAMPLES.CORP_YN_NM,
    bzmnNm: SWAGGER_EXAMPLES.BZMN_NM,
    bzmnRgsSttusSeNm: SWAGGER_EXAMPLES.BZMN_RGS_STTUS_SE_NM,
    crno: SWAGGER_EXAMPLES.CRNO,
    brno: SWAGGER_EXAMPLES.BRNO,
    telno: SWAGGER_EXAMPLES.TELNO,
    fxno: SWAGGER_EXAMPLES.FXNO,
    lctnRnAddr: SWAGGER_EXAMPLES.LCTN_RN_ADDR,
    lctnAddr: SWAGGER_EXAMPLES.LCTN_ADDR,
    domnCn: SWAGGER_EXAMPLES.DOMN_CN,
    opnServerPlaceAladr: SWAGGER_EXAMPLES.OPN_SERVER_PLACE_ALADDR,
    ntslMthdNm: SWAGGER_EXAMPLES.NTSL_MTHD_NM,
    ntslMthdCn: SWAGGER_EXAMPLES.NTSL_MTHD_CN,
    trtmntPrdlstNm: SWAGGER_EXAMPLES.TRTMNT_PRDLST_NM,
    ntslPrdlstCn: SWAGGER_EXAMPLES.NTSL_PRDLST_CN,
    dclrCn: SWAGGER_EXAMPLES.DCLR_CN,
    chgCn: SWAGGER_EXAMPLES.CHG_CN,
    chgRsnCn: SWAGGER_EXAMPLES.CHG_RSN_CN,
    tcbizBgngDate: SWAGGER_EXAMPLES.TCBIZ_BGNG_DATE,
    tcbizEndDate: SWAGGER_EXAMPLES.TCBIZ_END_DATE,
    clsbizDate: SWAGGER_EXAMPLES.CLSBIZ_DATE,
    bsnResmptDate: SWAGGER_EXAMPLES.BSN_RESMPT_DATE,
    spcssRsnCn: SWAGGER_EXAMPLES.SPCSS_RSN_CN,
    dclrDate: SWAGGER_EXAMPLES.DCLR_DATE,
    lctnRnOzip: SWAGGER_EXAMPLES.LCTN_RN_OZIP,
    rnAddr: SWAGGER_EXAMPLES.RN_ADDR,
    opnMdfcnDt: SWAGGER_EXAMPLES.OPN_MDFCN_DT,
    prcsDeptDtlNm: SWAGGER_EXAMPLES.PRCS_DEPT_DTL_NM,
    prcsDeptAreaNm: SWAGGER_EXAMPLES.PRCS_DEPT_AREA_NM,
    prcsDeptNm: SWAGGER_EXAMPLES.PRCS_DEPT_NM,
    chrgDeptTelno: SWAGGER_EXAMPLES.CHRG_DEPT_TELNO,
    rprsvNm: SWAGGER_EXAMPLES.RPRSV_NM,
    rprsvEmladr: SWAGGER_EXAMPLES.RPRSV_EMLADR,
  },
} as const;

export const SWAGGER_DESCRIPTIONS = {
  B_NO: "사업자등록번호 (10자리 숫자, 하이픈 제거)",
  P_NM: "대표자명 (외국인 사업자의 경우에는 영문명 입력)",
  START_DT: "개업일자 (YYYYMMDD 형식, 하이픈 제거)",
  B_NM: `상호 (1) 상호가 주식회사인 경우, 아래의 단어에 대해서는 상호의 맨 앞 또는 맨 뒤에 붙어도 동일하게 검색 가능 - (주) - 주식회사 - （주）--> 'ㄴ' 으로 한자키 입력을 통한 특수문자 괄호 2) 앞뒤 공백(empty space) 무시하고 검색))`,
  B_SECTOR: `업태명: (1) 모든 공백(앞뒤 포함)에 대해 무시하고 검색됨 예) '서 비 스' -> '서비스' 로 검색됨)`,
  B_TYPE: "종목명 (1) 모든 공백(앞뒤 포함)에 대해 무시하고 검색됨 (주업태명과 동일))",
  B_ADR:
    "사업장 주소 (모든 공백(앞뒤 포함)에 대해 무시하고 검색됨 (예시: 서울특별시 강남구, 경기도 부천시))",
  PRMMI_MNNO: "인허가관리번호 (통신판매사업자 신고번호, 예: 2021-서울강동-0422)",
} as const;
