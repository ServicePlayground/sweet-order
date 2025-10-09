import {
  Injectable,
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
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
  isPublic: boolean;
  roles?: UserRole[];
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

    // Public 엔드포인트인 경우 인증 건너뛰기
    if (authMetadata.isPublic) {
      return true;
    }

    // JWT 인증 수행
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // JWT 인증 실패 시
    if (err || !user) {
      throw err || new UnauthorizedException(AUTH_ERROR_MESSAGES.UNAUTHORIZED);
    }

    // 인증 메타데이터 가져오기
    const authMetadata = this.getAuthMetadata(context);

    // 역할 검증 (메타데이터가 있고 역할이 지정된 경우에만 수행)
    if (authMetadata?.roles && authMetadata.roles.length > 0) {
      const hasRequiredRole = authMetadata.roles.includes(user.role);
      if (!hasRequiredRole) {
        throw new ForbiddenException(AUTH_ERROR_MESSAGES.FORBIDDEN);
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
