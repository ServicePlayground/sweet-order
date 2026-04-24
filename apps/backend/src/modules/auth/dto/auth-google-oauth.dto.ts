import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsValidKoreanPhone } from "@apps/backend/common/decorators/validators.decorator";
import {
  SWAGGER_EXAMPLES,
  SWAGGER_DESCRIPTIONS,
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
 * 구글 연동 회원가입 요청 DTO
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
