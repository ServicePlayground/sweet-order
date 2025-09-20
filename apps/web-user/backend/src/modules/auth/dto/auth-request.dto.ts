import { IsString, MinLength, Matches, Length, IsPhoneNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

// 일반 회원가입 요청 DTO
export class RegisterRequestDto {
  @ApiProperty({
    description: "사용자 아이디",
    example: "user123",
    minLength: 4,
    maxLength: 20,
  })
  @IsString()
  @MinLength(4, { message: "아이디는 최소 4자 이상이어야 합니다." })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: "아이디는 영문, 숫자, 언더스코어만 사용할 수 있습니다." })
  userId: string;

  @ApiProperty({
    description: "비밀번호",
    example: "password123!",
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: "비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.",
  })
  password: string;

  @ApiProperty({
    description: "휴대폰 번호",
    example: "010-1234-5678",
  })
  @IsPhoneNumber("KR", { message: "올바른 휴대폰 번호 형식이 아닙니다." })
  phone: string;
}

// 휴대폰 인증번호 발송 요청 DTO
export class SendVerificationCodeRequestDto {
  @ApiProperty({
    description: "휴대폰 번호",
    example: "010-1234-5678",
  })
  @IsPhoneNumber("KR", { message: "올바른 휴대폰 번호 형식이 아닙니다." })
  phone: string;
}

// 휴대폰 인증번호 확인 요청 DTO
export class VerifyPhoneCodeRequestDto {
  @ApiProperty({
    description: "휴대폰 번호",
    example: "010-1234-5678",
  })
  @IsPhoneNumber("KR", { message: "올바른 휴대폰 번호 형식이 아닙니다." })
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
  @MinLength(4, { message: "아이디는 최소 4자 이상이어야 합니다." })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: "아이디는 영문, 숫자, 언더스코어만 사용할 수 있습니다." })
  userId: string;
}

// 휴대폰 번호 중복 확인 요청 DTO
export class CheckPhoneRequestDto {
  @ApiProperty({
    description: "확인할 휴대폰 번호",
    example: "010-1234-5678",
  })
  @IsPhoneNumber("KR", { message: "올바른 휴대폰 번호 형식이 아닙니다." })
  phone: string;
}
