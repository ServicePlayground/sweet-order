import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";

/**
 * JWT 인증 가드
 * Passport JWT 가드를 확장하여 Public 데코레이터가 있는 엔드포인트는 인증을 건너뜁니다.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | import("rxjs").Observable<boolean> {
    // Public 데코레이터가 있는 엔드포인트는 인증을 건너뜀
    const isPublic = this.reflector.getAllAndOverride<boolean>("isPublic", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
