import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TOKEN_TYPES } from "@web-user/backend/common/constants/app.constants";
import {
  JwtPayload,
  JwtVerifiedPayload,
  TokenPair,
} from "@web-user/backend/common/types/auth.types";

@Injectable()
export class JwtUtil {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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
        expiresIn: this.configService.get<string>("JWT_ACCESS_EXPIRES_IN"),
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRES_IN"),
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
}
