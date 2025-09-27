import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { JwtVerifiedPayload } from "@web-user/backend/common/types/auth.types";
import { TOKEN_TYPES } from "@web-user/backend/common/constants/app.constants";

/**
 * JWT 전략
 * Passport JWT 전략을 구현하여 JWT 토큰 검증을 처리합니다.
 *
 * 이 전략은 다음과 같은 검증을 수행합니다:
 * 1. Authorization 헤더에서 Bearer 토큰 추출
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
      // JWT 토큰을 Authorization 헤더에서 "Bearer <token>" 형태로 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
      // 1. 토큰 타입 검증: ACCESS 토큰만 허용 (REFRESH 토큰은 별도 처리)
      if (payload.type !== TOKEN_TYPES.ACCESS) {
        throw new UnauthorizedException("유효하지 않은 토큰 타입입니다.");
      }

      // 2. 필수 필드 검증: 사용자 식별에 필요한 정보가 모두 있는지 확인
      if (!payload.sub || !payload.phone || !payload.loginType || !payload.loginId) {
        throw new UnauthorizedException("토큰에 필수 정보가 누락되었습니다.");
      }

      // 모든 검증을 통과한 경우 사용자 정보 반환
      // 이 정보는 @Request() 데코레이터로 접근 가능한 req.user에 저장됩니다
      return payload;
    } catch (error) {
      // 예상치 못한 오류 발생 시에도 인증 실패로 처리
      throw new UnauthorizedException("토큰 검증에 실패했습니다.");
    }
  }
}
