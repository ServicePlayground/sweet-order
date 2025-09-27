import { ApiProperty } from "@nestjs/swagger";
import { UserInfo } from "@web-user/backend/common/types/auth.types";

/**
 * 인증 응답 DTO
 * 로그인, 회원가입 등 인증 성공 시 반환되는 응답 구조를 정의합니다.
 * (Response Interceptor가 자동으로 래핑)
 */

export class UserDataResponseDto {
  @ApiProperty({
    description: "액세스 토큰",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  accessToken: string;

  @ApiProperty({
    description: "리프레시 토큰",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  refreshToken: string;

  @ApiProperty({
    description: "사용자 정보",
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "사용자 ID",
        example: "1",
      },
      phone: {
        type: "string",
        description: "휴대폰 번호",
        example: "01012345678",
      },
      name: {
        type: "string",
        description: "사용자 이름",
        example: "test",
      },
      nickname: {
        type: "string",
        description: "닉네임",
        example: "test",
      },
      email: {
        type: "string",
        description: "이메일",
        example: "test@example.com",
      },
      profileImageUrl: {
        type: "string",
        description: "프로필 이미지 URL",
        example: "https://test.com/test.jpg",
      },
      isPhoneVerified: {
        type: "boolean",
        description: "휴대폰 인증 상태",
        example: true,
      },
      isActive: {
        type: "boolean",
        description: "활성 상태",
        example: true,
      },
      userId: {
        type: "string",
        description: "사용자 식별자",
        example: "test",
      },
      googleId: {
        type: "string",
        description: "구글 ID",
        example: "google123",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "생성일",
        example: "2023-01-01T00:00:00.000Z",
      },
      lastLoginAt: {
        type: "string",
        format: "date-time",
        description: "마지막 로그인",
        example: "2023-01-01T00:00:00.000Z",
      },
    },
  })
  user: UserInfo;
}

// 일반 - ID 찾기 응답 data DTO
export class FindUserIdDataResponseDto {
  @ApiProperty({
    description: "찾은 사용자 ID",
    example: "user123",
  })
  userId: string;
}
