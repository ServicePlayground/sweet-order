import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";
import { IsValidBusinessRegistrationNumber, IsValidOpeningDate } from "@apps/backend/common/decorators/validators.decorator";
import { SWAGGER_DESCRIPTIONS, SWAGGER_EXAMPLES } from "@apps/backend/modules/business/constants/business.contants";

/**
 * 사업자등록번호 진위확인 요청 DTO
 */
export class BusinessValidationRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.B_NO,
    example: SWAGGER_EXAMPLES.B_NO,
  })
  @IsValidBusinessRegistrationNumber()
  b_no: string; // 사업자등록번호

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.P_NM,
    example: SWAGGER_EXAMPLES.P_NM,
  })
  @IsString()
  @IsNotEmpty()
  p_nm: string; // 대표자성명1

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.START_DT,
    example: SWAGGER_EXAMPLES.START_DT,
  })
  @IsValidOpeningDate()
  start_dt: string; // 개업일자

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.B_NM,
    example: SWAGGER_EXAMPLES.B_NM
  })
  @IsString()
  @IsNotEmpty()
  b_nm: string; // 상호명

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.B_SECTOR,
    example: SWAGGER_EXAMPLES.B_SECTOR,
  })
  @IsString()
  @IsNotEmpty()
  b_sector: string; // 업태명

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.B_TYPE,
    example: SWAGGER_EXAMPLES.B_TYPE,
  })
  @IsString()
  @IsNotEmpty()
  b_type: string; // 종목명
}
