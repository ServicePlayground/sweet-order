import { applyDecorators, UseGuards, SetMetadata } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import {
  AuthGuard,
  AUTH_METADATA_KEY,
  AuthMetadata,
} from "@apps/backend/modules/auth/guards/auth.guard";
import { UserRole } from "@apps/backend/modules/auth/types/auth.types";

/**
 * 통합 인증 데코레이터
 * 인증과 권한을 하나의 데코레이터로 통합하여 처리합니다.
 *
 * @param options 인증 옵션 (필수)
 * @param options.isPublic - 인증을 건너뛸지 여부 (필수)
 * @param options.roles - 접근 가능한 역할들 (선택)
 *
 * @example
 * // 인증 없이 접근 가능
 * @Auth({ isPublic: true })
 *
 * // 인증 필요, 모든 역할 접근 가능
 * @Auth({ isPublic: false })
 *
 * // USER 역할만 접근 가능
 * @Auth({ isPublic: false, roles: ['USER'] })
 *
 * // SELLER, ADMIN 역할만 접근 가능
 * @Auth({ isPublic: false, roles: ['SELLER', 'ADMIN'] })
 *
 * // ADMIN 역할만 접근 가능
 * @Auth({ isPublic: false, roles: ['ADMIN'] })
 */
export function Auth(options: { isPublic: boolean; roles?: UserRole[] }) {
  const { isPublic, roles } = options;

  const decorators = [];

  // 인증 메타데이터 설정
  const authMetadata: AuthMetadata = {
    isPublic,
    roles,
  };

  decorators.push(SetMetadata(AUTH_METADATA_KEY, authMetadata));

  // Public 엔드포인트가 아닌 경우 통합 가드 적용
  if (!isPublic) {
    // 사용자 요청 → Controller → @Auth 데코레이터 → AuthGuard → Passport → JwtStrategy → validate() → req.user
    decorators.push(UseGuards(AuthGuard));
    // Swagger UI에서 Bearer 토큰 인증 지원
    decorators.push(ApiBearerAuth("JWT-auth"));
  }

  return applyDecorators(...decorators);
}
