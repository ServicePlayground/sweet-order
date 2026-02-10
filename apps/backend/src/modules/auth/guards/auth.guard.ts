import { Injectable, ExecutionContext, CanActivate, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { AuthGuard as BaseAuthGuard } from "@nestjs/passport";
import { UserRole } from "@apps/backend/modules/auth/types/auth.types";
import { AUTH_ERROR_MESSAGES } from "@apps/backend/modules/auth/constants/auth.constants";

/**
 * 통합 인증 메타데이터 키
 */
export const AUTH_METADATA_KEY = "auth";

/**
 * 인증 메타데이터 인터페이스
 */
export interface AuthMetadata {
  isPublic: boolean; // 인증 건너뛰기
  isOptionalPublic?: boolean; // 선택적 인증: 토큰이 있으면 검증하고 user 설정, 없으면 통과
  roles?: UserRole[]; // 역할 검증
}

/**
 * 통합 인증 가드
 * JWT 인증과 역할 기반 권한을 통합하여 처리합니다.
 */
@Injectable()
export class AuthGuard extends BaseAuthGuard("jwt") implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 인증 메타데이터 가져오기
    const authMetadata = this.getAuthMetadata(context);

    // 메타데이터가 없으면 기본 인증 적용
    if (!authMetadata) {
      return super.canActivate(context);
    }

    // OptionalPublic 엔드포인트인 경우 선택적 인증 (토큰이 있으면 검증, 없으면 통과)
    // isPublic과 isOptionalPublic이 모두 true인 경우, OptionalPublic을 우선 처리
    if (authMetadata.isOptionalPublic) {
      // 토큰이 있는지 확인
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers?.authorization;
      const hasToken = authHeader && authHeader.startsWith("Bearer ");

      // 토큰이 있으면 인증 시도
      if (hasToken) {
        return super.canActivate(context) as Promise<boolean>;
      }

      // 토큰이 없으면 그냥 통과
      return true;
    }

    // Public 엔드포인트인 경우 인증 건너뛰기
    if (authMetadata.isPublic) {
      return true;
    }

    // JWT 인증 수행
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // 인증 메타데이터 가져오기
    const authMetadata = this.getAuthMetadata(context);

    // OptionalPublic 엔드포인트이고 인증 실패한 경우, 에러를 던지지 않고 undefined 반환
    if (authMetadata?.isOptionalPublic && (err || !user)) {
      // 토큰이 있었지만 검증 실패한 경우 (만료, 잘못된 토큰 등)
      // OptionalPublic 엔드포인트이므로 에러를 던지지 않고 undefined 반환
      return undefined;
    }

    // OptionalPublic이 아닌 엔드포인트이거나 OptionalPublic이지만 인증 성공한 경우
    if (err || !user) {
      // 이미 Nest UnauthorizedException으로 올라온 경우는 그대로 전달
      if (err instanceof UnauthorizedException) {
        throw err;
      }

      // Passport가 전달하는 info는 Error 객체일 수 있음(TokenExpiredError, JsonWebTokenError 등)
      const errorName = info?.name || err?.name;

      if (errorName === "TokenExpiredError") {
        throw new UnauthorizedException(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED);
      }

      if (errorName === "JsonWebTokenError") {
        throw new UnauthorizedException(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID);
      }

      // 그 외 토큰 누락 등 일반 인증 실패
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.UNAUTHORIZED);
    }

    // 역할 검증 (메타데이터가 있고 역할이 지정된 경우에만 수행)
    if (authMetadata?.roles && authMetadata.roles.length > 0) {
      const hasRequiredRole = authMetadata.roles.includes(user.role);
      if (!hasRequiredRole) {
        throw new UnauthorizedException(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED);
      }
    }

    return user;
  }

  /**
   * 인증 메타데이터를 가져오는 헬퍼 메서드
   * 중복 코드를 제거하고 성능을 최적화합니다.
   */
  private getAuthMetadata(context: ExecutionContext): AuthMetadata | undefined {
    return this.reflector.getAllAndOverride<AuthMetadata>(AUTH_METADATA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
