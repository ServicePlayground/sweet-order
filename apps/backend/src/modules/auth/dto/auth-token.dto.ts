import { ApiProperty } from "@nestjs/swagger";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/auth/constants/auth.constants";

/**
 * 로그인·회원가입 등에서 발급하는 액세스·리프레시 토큰 쌍 (응답 본문)
 */
export class AuthTokenPairResponseDto {
  @ApiProperty({
    description: "액세스 토큰 (JWT)",
    example: SWAGGER_EXAMPLES.TOKEN_RESPONSE.accessToken,
  })
  accessToken: string;

  @ApiProperty({
    description: "리프레시 토큰 (JWT)",
    example: SWAGGER_EXAMPLES.TOKEN_RESPONSE.refreshToken,
  })
  refreshToken: string;
}
