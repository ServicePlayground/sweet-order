import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { TOKEN_TYPES } from "@web-user/backend/common/constants/app.constants";
import {
  JwtPayload,
  JwtVerifiedPayload,
  TokenPair,
} from "@web-user/backend/common/types/auth.types";

@Injectable()
export class JwtUtil {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 액세스 토큰과 리프레시 토큰을 생성합니다.
   * @param payload JWT 페이로드
   * @returns 토큰 쌍
   */
  async generateTokenPair(payload: JwtPayload): Promise<TokenPair> {
    const accessTokenPayload = {
      ...payload,
      type: TOKEN_TYPES.ACCESS,
    };

    const refreshTokenPayload = {
      ...payload,
      type: TOKEN_TYPES.REFRESH,
    };

    // 액세스 토큰과 리프레시 토큰 생성
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 토큰을 검증하고 페이로드를 반환합니다.
   * @param token JWT 토큰
   * @returns 검증된 페이로드
   */
  async verifyToken(token: string): Promise<JwtVerifiedPayload> {
    return this.jwtService.verifyAsync(token);
  }

  /**
   * 리프레시 토큰으로 새로운 액세스 토큰을 생성합니다.
   * @param refreshToken 리프레시 토큰
   * @param userInfo 사용자 정보
   * @returns 새로운 토큰 쌍
   */
  async refreshAccessToken(
    refreshToken: string,
    userInfo: { id: string; userId: string; phone: string },
  ): Promise<TokenPair> {
    // 리프레시 토큰 검증
    const payload = await this.verifyToken(refreshToken);

    // TODO: 로그 아웃이 되거나 권한없음 처리 로직 추가해야함

    if (payload.type !== TOKEN_TYPES.REFRESH) {
      throw new Error("Invalid token type");
    }

    // 새로운 토큰 쌍 생성
    return this.generateTokenPair({
      sub: userInfo.id,
      userId: userInfo.userId,
      phone: userInfo.phone,
    });
  }
}
