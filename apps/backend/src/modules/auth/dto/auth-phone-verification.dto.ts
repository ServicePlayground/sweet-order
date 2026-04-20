import { IsString, IsEnum, IsIn } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsValidKoreanPhone,
  IsValidVerificationCode,
} from "@apps/backend/common/decorators/validators.decorator";
import {
  AUDIENCE,
  SWAGGER_EXAMPLES,
  SWAGGER_DESCRIPTIONS,
  PhoneVerificationPurpose,
  AudienceConst,
} from "@apps/backend/modules/auth/constants/auth.constants";

/**
 * 휴대폰 인증번호 발송 요청 DTO
 */
export class SendVerificationCodeRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PHONE,
    example: SWAGGER_EXAMPLES.CONSUMER_DATA.phone,
  })
  @IsString()
  @IsValidKoreanPhone()
  phone: string;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PHONE_VERIFICATION_AUDIENCE,
    example: AUDIENCE.CONSUMER,
    enum: [AUDIENCE.CONSUMER, AUDIENCE.SELLER],
  })
  @IsIn([AUDIENCE.CONSUMER, AUDIENCE.SELLER])
  audience: AudienceConst;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PHONE_VERIFICATION_PURPOSE,
    example: PhoneVerificationPurpose.REGISTRATION,
    enum: PhoneVerificationPurpose,
  })
  @IsEnum(PhoneVerificationPurpose)
  purpose: PhoneVerificationPurpose;
}

/**
 * 휴대폰 인증번호 확인 요청 DTO
 */
export class VerifyPhoneCodeRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PHONE,
    example: SWAGGER_EXAMPLES.CONSUMER_DATA.phone,
  })
  @IsString()
  @IsValidKoreanPhone()
  phone: string;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.VERIFICATION_CODE,
    example: SWAGGER_EXAMPLES.VERIFICATION_CODE,
  })
  @IsString()
  @IsValidVerificationCode()
  verificationCode: string;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PHONE_VERIFICATION_AUDIENCE,
    example: AUDIENCE.CONSUMER,
    enum: [AUDIENCE.CONSUMER, AUDIENCE.SELLER],
  })
  @IsIn([AUDIENCE.CONSUMER, AUDIENCE.SELLER])
  audience: AudienceConst;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PHONE_VERIFICATION_PURPOSE,
    example: PhoneVerificationPurpose.REGISTRATION,
    enum: PhoneVerificationPurpose,
  })
  @IsEnum(PhoneVerificationPurpose)
  purpose: PhoneVerificationPurpose;
}
