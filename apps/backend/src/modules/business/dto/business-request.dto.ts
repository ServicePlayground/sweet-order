import { ApiProperty } from "@nestjs/swagger";
import {
  IsValidBusinessNo,
  IsValidRepresentativeName,
  IsValidStartDate,
  IsValidBusinessName,
  IsValidBusinessSector,
  IsValidBusinessType,
  IsValidPermissionManagementNumber,
} from "@apps/backend/modules/business/decorators/validators.decorator";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/business/constants/business.contants";

/**
 * 사업자등록번호 진위확인 요청 DTO
 */
export class BusinessValidationRequestDto {
  @ApiProperty({
    description: "사업자등록번호 (10자리 숫자, 하이픈 제거)",
    example: SWAGGER_EXAMPLES.B_NO,
  })
  @IsValidBusinessNo()
  b_no: string; // 사업자등록번호

  @ApiProperty({
    description: "대표자명 (외국인 사업자의 경우에는 영문명 입력)",
    example: SWAGGER_EXAMPLES.P_NM,
  })
  @IsValidRepresentativeName()
  p_nm: string; // 대표자성명1

  @ApiProperty({
    description: "개업일자 (YYYYMMDD 형식, 하이픈 제거)",
    example: SWAGGER_EXAMPLES.START_DT,
  })
  @IsValidStartDate()
  start_dt: string; // 개업일자

  @ApiProperty({
    description: `상호 (1) 상호가 주식회사인 경우, 아래의 단어에 대해서는 상호의 맨 앞 또는 맨 뒤에 붙어도 동일하게 검색 가능 - (주) - 주식회사 - （주）--> 'ㄴ' 으로 한자키 입력을 통한 특수문자 괄호 2) 앞뒤 공백(empty space) 무시하고 검색))`,
    example: SWAGGER_EXAMPLES.B_NM,
  })
  @IsValidBusinessName()
  b_nm: string; // 상호명

  @ApiProperty({
    description: `업태명: (1) 모든 공백(앞뒤 포함)에 대해 무시하고 검색됨 예) '서 비 스' -> '서비스' 로 검색됨)`,
    example: SWAGGER_EXAMPLES.B_SECTOR,
  })
  @IsValidBusinessSector()
  b_sector: string; // 업태명

  @ApiProperty({
    description: "종목명 (1) 모든 공백(앞뒤 포함)에 대해 무시하고 검색됨 (주업태명과 동일))",
    example: SWAGGER_EXAMPLES.B_TYPE,
  })
  @IsValidBusinessType()
  b_type: string; // 종목명
}

/**
 * 통신판매사업자 등록상세 조회 요청 DTO
 */
export class OnlineTradingCompanyDetailRequestDto {
  @ApiProperty({
    description: "사업자등록번호 (10자리 숫자, 하이픈 제거)",
    example: SWAGGER_EXAMPLES.BRNO,
  })
  @IsValidBusinessNo()
  brno: string; // 사업자등록번호

  @ApiProperty({
    description: "인허가관리번호 (통신판매사업자 신고번호, 예: 2021-서울강동-0422)",
    example: SWAGGER_EXAMPLES.PRMMI_MNNO,
  })
  @IsValidPermissionManagementNumber()
  prmmiMnno: string; // 인허가관리번호(통신판매사업자 신고번호)
}
