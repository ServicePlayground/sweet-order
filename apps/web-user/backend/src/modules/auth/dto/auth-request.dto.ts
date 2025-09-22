import { IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsValidUserId,
  IsValidPassword,
  IsValidKoreanPhone,
} from "@web-user/backend/common/decorators/validators.decorator";

// 일반 회원가입 요청 DTO
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
    example: "password123!",
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

// 사용자 ID 중복 확인 요청 DTO
export class CheckUserIdRequestDto {
  @ApiProperty({
    description: "확인할 사용자 아이디",
    example: "user123",
  })
  @IsString()
  @IsValidUserId()
  userId: string;
}

// 휴대폰 번호 중복 확인 요청 DTO
export class CheckPhoneRequestDto {
  @ApiProperty({
    description: "확인할 휴대폰 번호",
    example: "010-1234-5678",
  })
  @IsString()
  @IsValidKoreanPhone()
  phone: string;
}
