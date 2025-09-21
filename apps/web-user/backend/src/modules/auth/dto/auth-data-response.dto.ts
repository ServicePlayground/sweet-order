import { ApiProperty } from "@nestjs/swagger";
import { UserInfo } from "@web-user/backend/common/types/auth.types";

/**
 * 인증 응답 DTO
 * 로그인, 회원가입 등 인증 성공 시 반환되는 응답 구조를 정의합니다.
 */

// 일반 회원가입 응답 data DTO (Response Interceptor가 자동으로 래핑)
export class RegisterDataDto {
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
      userId: {
        type: "string",
        description: "사용자 식별자",
        example: "test",
      },
      name: {
        type: "string",
        description: "사용자 이름",
        example: "test",
      },
      phone: {
        type: "string",
        description: "휴대폰 번호",
        example: "01012345678",
      },
      nickname: {
        type: "string",
        description: "닉네임",
        example: "test",
      },
      profileImageUrl: {
        type: "string",
        description: "프로필 이미지 URL",
        example: "https://test.com/test.jpg",
      },
      isVerified: {
        type: "boolean",
        description: "인증 상태",
        example: true,
      },
    },
  })
  user: UserInfo;
}
