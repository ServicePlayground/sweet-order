import { IsString, IsNotEmpty, IsEnum, IsIn, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
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
 * 구글 로그인 요청 DTO (Authorization Code)
 */
export class GoogleLoginRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.GOOGLE_CODE,
    example: SWAGGER_EXAMPLES.GOOGLE_CODE,
  })
  @IsNotEmpty()
  @IsString()
  code: string;
}

/**
 * 구글 로그인 회원가입 요청 DTO
 */
export class GoogleRegisterRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.GOOGLE_ID,
    example: SWAGGER_EXAMPLES.CONSUMER_DATA.googleId,
  })
  @IsNotEmpty()
  @IsString()
  googleId: string;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.GOOGLE_EMAIL,
    example: SWAGGER_EXAMPLES.CONSUMER_DATA.googleEmail,
  })
  @IsNotEmpty()
  @IsString()
  googleEmail: string;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.DISPLAY_NAME,
    example: SWAGGER_EXAMPLES.CONSUMER_DATA.name,
  })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PHONE,
    example: SWAGGER_EXAMPLES.CONSUMER_DATA.phone,
  })
  @IsString()
  @IsValidKoreanPhone()
  phone: string;
}

// 휴대폰 인증번호 발송 요청 DTO
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

// 휴대폰 인증번호 확인 요청 DTO
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

/** 계정 찾기 — 휴대폰 인증(FIND_ACCOUNT 목적) 완료 후 요청 */
export class FindAccountRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PHONE,
    example: SWAGGER_EXAMPLES.CONSUMER_DATA.phone,
  })
  @IsString()
  @IsValidKoreanPhone()
  phone: string;
}

// 휴대폰 번호 변경 요청 DTO
export class ChangePhoneRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PHONE,
    example: SWAGGER_EXAMPLES.CONSUMER_DATA.phone,
  })
  @IsString()
  @IsValidKoreanPhone()
  newPhone: string;
}
