import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  AUTH_ERROR_MESSAGES,
  TOKEN_TYPES,
} from "@apps/backend/modules/auth/constants/auth.constants";

/**
 * JWT 전략
 * Passport JWT 전략을 구현하여 JWT 토큰 검증을 처리합니다.
 * 사용자 요청 → Controller → @Auth 데코레이터 → AuthGuard → Passport → JwtStrategy → validate() → req.user
 *
 * 이 전략은 다음과 같은 검증을 수행합니다:
 * 1. 쿠키에서 access_token 추출 (서브도메인 통합 로그인)
 * 2. JWT 시크릿 키로 토큰 서명 검증
 * 3. 토큰 만료 시간 확인 (Passport가 자동 처리)
 * 4. 토큰 타입이 ACCESS 토큰인지 확인
 * 5. 필수 페이로드 필드 존재 여부 확인 (sub, userId, phone)
 *
 * 검증이 성공하면 사용자 정보를 반환하고, 실패하면 UnauthorizedException을 발생시킵니다.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>("JWT_SECRET");
    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is required");
    }

    super({
      // JWT 토큰 추출: 쿠키에서 추출
      jwtFromRequest: (req: Request) => {
        // 쿠키에서 access_token 추출
        const accessToken = req.cookies?.access_token;

        // 토큰이 없는 경우 명시적으로 에러 발생
        if (!accessToken) {
          throw new UnauthorizedException(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING);
        }

        return accessToken;
      },
      // JWT 서명 검증을 위한 시크릿 키
      secretOrKey: jwtSecret,
      // 토큰 만료 시간 검증을 활성화 (false = 만료된 토큰 거부)
      ignoreExpiration: false,
    });
  }

  /**
   * JWT 토큰을 검증하고 사용자 정보를 반환합니다.
   *
   * Passport가 JWT 토큰을 디코딩한 후 이 메서드를 호출하여 추가 검증을 수행합니다.
   *
   * @param payload JWT 페이로드 (토큰에서 추출된 사용자 정보)
   * @returns 검증된 사용자 정보 (요청 객체의 user 속성에 저장됨)
   * @throws UnauthorizedException 토큰 검증 실패 시
   */
  async validate(payload: JwtVerifiedPayload): Promise<JwtVerifiedPayload> {
    try {
      // 0. Access Token 검증 (JWT 서명 및 만료시간 자동 검증)
      // 이 부분은 Passport JWT가 자동으로 처리하므로 여기서는 처리하지 않습니다.
      // 토큰 만료: Passport가 자동으로 TokenExpiredError 발생, 서명 오류: JsonWebTokenError 발생

      // 1. 토큰 타입 검증: ACCESS 토큰만 허용 (REFRESH 토큰은 별도 처리)
      if (payload.type !== TOKEN_TYPES.ACCESS) {
        throw new UnauthorizedException(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE);
      }

      // 2. 필수 필드 검증: 사용자 식별에 필요한 정보가 모두 있는지 확인
      if (
        !payload.sub ||
        !payload.phone ||
        !payload.loginType ||
        !payload.loginId ||
        !payload.role
      ) {
        throw new UnauthorizedException(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING_REQUIRED_INFO);
      }

      // 모든 검증을 통과한 경우 사용자 정보 반환
      // 이 정보는 @Request() 데코레이터로 접근 가능한 req.user에 저장됩니다
      return payload;
    } catch (error) {
      // 이미 UnauthorizedException인 경우 그대로 던지기
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // JWT 토큰 만료 에러
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED);
      }

      // JWT 토큰 형식 오류, 서명 오류 등
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID);
      }

      // 기타 예상치 못한 오류
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID);
    }
  }
}
