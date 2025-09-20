import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { JwtPayload, TokenPair } from "@web-user/backend/common/types/jwt.types";
import { TOKEN_TYPES } from "@web-user/backend/common/constants/app.constants";

@Injectable()
export class JwtUtil {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 액세스 토큰과 리프레시 토큰을 생성합니다.
   * @param payload JWT 페이로드
   * @returns 토큰 쌍
   */
  async generateTokenPair(payload: Omit<JwtPayload, "iat" | "exp">): Promise<TokenPair> {
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
  async verifyToken(token: string): Promise<JwtPayload> {
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
    userInfo: { id: string; userId: string; phone?: string },
  ): Promise<TokenPair> {
    // 리프레시 토큰 검증
    const payload = await this.verifyToken(refreshToken);

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

  /**
   * 토큰 만료 시간을 초 단위로 변환합니다.
   * @param expiresIn 만료 시간 문자열 (예: '1h', '30m', '7d')
   * @returns 초 단위 만료 시간
   */
  private getTokenExpirationTime(expiresIn: string): number {
    const timeUnit = expiresIn.slice(-1);
    const timeValue = parseInt(expiresIn.slice(0, -1));

    switch (timeUnit) {
      case "s":
        return timeValue;
      case "m":
        return timeValue * 60;
      case "h":
        return timeValue * 60 * 60;
      case "d":
        return timeValue * 24 * 60 * 60;
      default:
        return 3600; // 기본값: 1시간
    }
  }

  /**
   * 토큰에서 사용자 ID를 추출합니다.
   * @param token JWT 토큰
   * @returns 사용자 ID
   */
  async extractUserId(token: string): Promise<string> {
    const payload = await this.verifyToken(token);
    return payload.sub;
  }

  /**
   * 토큰에서 사용자 식별자를 추출합니다.
   * @param token JWT 토큰
   * @returns 사용자 식별자
   */
  async extractUserIdentifier(token: string): Promise<string> {
    const payload = await this.verifyToken(token);
    return payload.userId;
  }
}
