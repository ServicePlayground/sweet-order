import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";
import { IsValidBusinessRegistrationNumber, IsValidOpeningDate } from "@apps/backend/common/decorators/validators.decorator";
import { SWAGGER_DESCRIPTIONS, SWAGGER_EXAMPLES } from "@apps/backend/modules/business/constants/business.contants";

/**
 * 사업자등록번호 진위확인 요청 DTO
 */
export class BusinessValidationRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.BUSINESS_REGISTRATION_NUMBER,
    example: SWAGGER_EXAMPLES.BUSINESS_REGISTRATION_NUMBER,
  })
  @IsValidBusinessRegistrationNumber()
  businessRegistrationNumber: string;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.REPRESENTATIVE_NAME,
    example: SWAGGER_EXAMPLES.REPRESENTATIVE_NAME,
  })
  @IsString()
  @IsNotEmpty()
  representativeName: string;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.OPENING_DATE,
    example: SWAGGER_EXAMPLES.OPENING_DATE,
  })
  @IsValidOpeningDate()
  openingDate: string;
}
