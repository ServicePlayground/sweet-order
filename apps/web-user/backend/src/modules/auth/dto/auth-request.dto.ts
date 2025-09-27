import { IsString, Length, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsValidUserId,
  IsValidPassword,
  IsValidKoreanPhone,
} from "@web-user/backend/common/decorators/validators.decorator";

// 일반 - 회원가입 요청 DTO
export class RegisterRequestDto {
  @ApiProperty({
    description: "사용자 아이디",
    example: "user123",
    minLength: 4,
    maxLength: 20,
  })
  @IsString()
  @IsValidUserId()
  userId: string;

  @ApiProperty({
    description: "비밀번호",
    example: "Password123!",
    minLength: 8,
  })
  @IsString()
  @IsValidPassword()
  password: string;

  @ApiProperty({
    description: "휴대폰 번호",
    example: "010-1234-5678",
  })
  @IsString()
  @IsValidKoreanPhone()
  phone: string;
}

// 일반 - ID 중복 확인 요청 DTO
export class CheckUserIdRequestDto {
  @ApiProperty({
    description: "확인할 사용자 아이디",
    example: "user123",
  })
  @IsString()
  @IsValidUserId()
  userId: string;
}

// 일반 - 로그인 요청 DTO
export class LoginRequestDto {
  @ApiProperty({
    description: "사용자 아이디",
    example: "user123",
  })
  @IsString()
  @IsValidUserId()
  userId: string;

  @ApiProperty({
    description: "비밀번호",
    example: "Password123!",
  })
  @IsString()
  @IsValidPassword()
  password: string;
}

// 일반 - ID 찾기 요청 DTO
export class FindUserIdRequestDto {
  @ApiProperty({
    description: "휴대폰 번호",
    example: "010-1234-5678",
  })
  @IsString()
  @IsValidKoreanPhone()
  phone: string;
}

// 일반 - 비밀번호 변경 요청 DTO
export class ChangePasswordRequestDto {
  @ApiProperty({
    description: "사용자 아이디",
    example: "user123",
  })
  @IsString()
  @IsValidUserId()
  userId: string;

  @ApiProperty({
    description: "휴대폰 번호",
    example: "010-1234-5678",
  })
  @IsString()
  @IsValidKoreanPhone()
  phone: string;

  @ApiProperty({
    description: "새로운 비밀번호",
    example: "NewPassword123!",
    minLength: 8,
  })
  @IsString()
  @IsValidPassword()
  newPassword: string;
}

// 휴대폰 인증번호 발송 요청 DTO
export class SendVerificationCodeRequestDto {
  @ApiProperty({
    description: "휴대폰 번호",
    example: "010-1234-5678",
  })
  @IsString()
  @IsValidKoreanPhone()
  phone: string;
}

// 휴대폰 인증번호 확인 요청 DTO
export class VerifyPhoneCodeRequestDto {
  @ApiProperty({
    description: "휴대폰 번호",
    example: "010-1234-5678",
  })
  @IsString()
  @IsValidKoreanPhone()
  phone: string;

  @ApiProperty({
    description: "인증번호",
    example: "123456",
  })
  @IsString()
  @Length(6, 6, { message: "인증번호는 6자리여야 합니다." })
  verificationCode: string;
}

// 휴대폰 번호 변경 요청 DTO
export class ChangePhoneRequestDto {
  @ApiProperty({
    description: "기존 휴대폰 번호",
    example: "010-1234-5678",
  })
  @IsString()
  @IsValidKoreanPhone()
  oldPhone: string;

  @ApiProperty({
    description: "새로운 휴대폰 번호",
    example: "010-9876-5432",
  })
  @IsString()
  @IsValidKoreanPhone()
  newPhone: string;
}

/**
 * 구글 로그인 요청 DTO (Authorization Code)
 */
export class GoogleLoginRequestDto {
  @ApiProperty({
    description: "구글에서 받은 Authorization Code",
    example: "4/0AVGzR1BWFlPYjsU53FD39J4-JQPvDk5mcygFcOM0SBhus6Dw_8UsjZUxCvkKhtVIz92-1w",
  })
  @IsString()
  code: string;
}

/**
 * 구글 로그인 회원가입 요청 DTO
 */
export class GoogleRegisterRequestDto {
  @ApiProperty({
    description: "구글 ID",
    example: "google123",
  })
  @IsString()
  googleId: string;

  @ApiProperty({
    description: "휴대폰 번호",
    example: "010-1234-5678",
  })
  @IsString()
  @IsValidKoreanPhone()
  phone: string;
}

/**
 * Refresh Token 갱신 요청 DTO
 */
export class RefreshTokenRequestDto {
  @ApiProperty({
    description: "리프레시 토큰",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
