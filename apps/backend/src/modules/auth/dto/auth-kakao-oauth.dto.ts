import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsValidKoreanPhone } from "@apps/backend/common/decorators/validators.decorator";
import {
  SWAGGER_EXAMPLES,
  SWAGGER_DESCRIPTIONS,
} from "@apps/backend/modules/auth/constants/auth.constants";

/**
 * 카카오 로그인 요청 DTO (Authorization Code)
 */
export class KakaoLoginRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.KAKAO_CODE,
    example: SWAGGER_EXAMPLES.KAKAO_CODE,
  })
  @IsNotEmpty()
  @IsString()
  code: string;
}

/**
 * 카카오 연동 회원가입 요청 DTO
 */
export class KakaoRegisterRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.KAKAO_ID,
    example: SWAGGER_EXAMPLES.KAKAO_ID,
  })
  @IsNotEmpty()
  @IsString()
  kakaoId: string;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.KAKAO_EMAIL,
    example: SWAGGER_EXAMPLES.KAKAO_EMAIL,
  })
  @IsNotEmpty()
  @IsString()
  kakaoEmail: string;

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
