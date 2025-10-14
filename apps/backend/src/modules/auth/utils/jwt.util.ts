import { JwtService } from "@nestjs/jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  TOKEN_TYPES,
  AUTH_ERROR_MESSAGES,
} from "@apps/backend/modules/auth/constants/auth.constants";
import {
  JwtPayload,
  JwtVerifiedPayload,
  TokenPair,
} from "@apps/backend/modules/auth/types/auth.types";
import { RefreshTokenRequestDto } from "@apps/backend/modules/auth/dto/auth-request.dto";

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
        expiresIn: "1h",
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        expiresIn: "30d",
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
   * Refresh Token을 사용하여 새로운 Access Token을 생성합니다.
   * @param refreshTokenDto 리프레시 토큰 요청 DTO
   * @returns 새로운 액세스 토큰
   */
  async refreshAccessToken(refreshTokenDto: RefreshTokenRequestDto): Promise<string> {
    try {
      const { refreshToken } = refreshTokenDto;

      // Refresh Token 검증 (JWT 서명 및 만료시간 자동 검증)
      const payload = await this.verifyToken(refreshToken);

      // 토큰 타입이 refresh token인지 확인
      if (payload.type !== TOKEN_TYPES.REFRESH) {
        throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
      }

      // 새로운 Access Token 생성
      const accessTokenPayload = {
        sub: payload.sub,
        phone: payload.phone,
        loginType: payload.loginType,
        loginId: payload.loginId,
        role: payload.role,
        type: TOKEN_TYPES.ACCESS,
      };

      const newAccessToken = await this.jwtService.signAsync(accessTokenPayload, {
        expiresIn: this.configService.get<string>("JWT_ACCESS_EXPIRES_IN"),
      });

      return newAccessToken;
    } catch (error) {
      // 이미 UnauthorizedException인 경우 그대로 던지기
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // JWT 검증 실패 등 기타 오류는 401로 처리
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }
  }
}
