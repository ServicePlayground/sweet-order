import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";

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

  handleRequest(err: unknown, user: unknown, _info: unknown): any {
    if (err || !user) {
      throw err || new UnauthorizedException("인증이 필요합니다.");
    }
    return user;
  }
}
