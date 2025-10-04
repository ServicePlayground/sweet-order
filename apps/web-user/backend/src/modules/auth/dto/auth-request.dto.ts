import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsValidUserId,
  IsValidPassword,
  IsValidKoreanPhone,
  IsValidVerificationCode,
} from "@web-user/backend/common/decorators/validators.decorator";
import {
  SWAGGER_EXAMPLES,
  SWAGGER_DESCRIPTIONS,
} from "@web-user/backend/modules/auth/constants/auth.constants";

// 일반 - 회원가입 요청 DTO
export class RegisterRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.USER_ID,
    example: SWAGGER_EXAMPLES.USER_DATA.userId,
  })
  @IsString()
  @IsValidUserId()
  userId: string;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PASSWORD,
    example: SWAGGER_EXAMPLES.PASSWORD,
  })
  @IsString()
  @IsValidPassword()
  password: string;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PHONE,
    example: SWAGGER_EXAMPLES.USER_DATA.phone,
  })
  @IsString()
  @IsValidKoreanPhone()
  phone: string;
}

// 일반 - ID 중복 확인 요청 DTO
export class CheckUserIdRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.USER_ID,
    example: SWAGGER_EXAMPLES.USER_DATA.userId,
  })
  @IsString()
  @IsValidUserId()
  userId: string;
}

// 일반 - 로그인 요청 DTO
export class LoginRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.USER_ID,
    example: SWAGGER_EXAMPLES.USER_DATA.userId,
  })
  @IsString()
  @IsValidUserId()
  userId: string;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PASSWORD,
    example: SWAGGER_EXAMPLES.PASSWORD,
  })
  @IsString()
  @IsValidPassword()
  password: string;
}

// 일반 - 비밀번호 변경 요청 DTO
export class ChangePasswordRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.USER_ID,
    example: SWAGGER_EXAMPLES.USER_DATA.userId,
  })
  @IsString()
  @IsValidUserId()
  userId: string;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PHONE,
    example: SWAGGER_EXAMPLES.USER_DATA.phone,
  })
  @IsString()
  @IsValidKoreanPhone()
  phone: string;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PASSWORD,
    example: SWAGGER_EXAMPLES.PASSWORD,
  })
  @IsString()
  @IsValidPassword()
  newPassword: string;
}

// 계정 찾기 요청 DTO
export class FindAccountRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PHONE,
    example: SWAGGER_EXAMPLES.USER_DATA.phone,
  })
  @IsString()
  @IsValidKoreanPhone()
  phone: string;
}

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
    example: SWAGGER_EXAMPLES.USER_DATA.googleId,
  })
  @IsNotEmpty()
  @IsString()
  googleId: string;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.GOOGLE_EMAIL,
    example: SWAGGER_EXAMPLES.USER_DATA.googleEmail,
  })
  @IsNotEmpty()
  @IsString()
  googleEmail: string;

  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PHONE,
    example: SWAGGER_EXAMPLES.USER_DATA.phone,
  })
  @IsString()
  @IsValidKoreanPhone()
  phone: string;
}

// 휴대폰 인증번호 발송 요청 DTO
export class SendVerificationCodeRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PHONE,
    example: SWAGGER_EXAMPLES.USER_DATA.phone,
  })
  @IsString()
  @IsValidKoreanPhone()
  phone: string;
}

// 휴대폰 인증번호 확인 요청 DTO
export class VerifyPhoneCodeRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PHONE,
    example: SWAGGER_EXAMPLES.USER_DATA.phone,
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
}

// 휴대폰 번호 변경 요청 DTO
export class ChangePhoneRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PHONE,
    example: SWAGGER_EXAMPLES.USER_DATA.phone,
  })
  @IsString()
  @IsValidKoreanPhone()
  newPhone: string;
}

/**
 * Refresh Token 갱신 요청 DTO
 */
export class RefreshTokenRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.REFRESH_TOKEN,
    example: SWAGGER_EXAMPLES.REFRESH_TOKEN,
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
