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
 * @param options 인증 옵션
 * @param options.isPublic - 인증을 건너뛸지 여부 (isOptionalPublic과 함께 사용 불가)
 * @param options.isOptionalPublic - 선택적 인증: 토큰이 있으면 검증하고 user 설정, 없으면 통과 (isLiked 등에 사용, isPublic과 함께 사용 불가)
 * @param options.roles - 접근 가능한 역할들 (선택)
 *
 * @example
 * // 인증 없이 접근 가능
 * @Auth({ isPublic: true })
 *
 * // 선택적 인증: 토큰이 있으면 검증하고 user 설정, 없으면 통과 (isLiked 등에 사용)
 * @Auth({ isOptionalPublic: true })
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
export function Auth(options: {
  isPublic?: boolean;
  isOptionalPublic?: boolean;
  roles?: UserRole[];
}) {
  const { isPublic, isOptionalPublic, roles } = options;

  // isOptionalPublic이 true이면 isPublic도 자동으로 true로 처리
  const finalIsPublic = isOptionalPublic ? true : (isPublic ?? false);

  const decorators = [];

  // 인증 메타데이터 설정
  const authMetadata: AuthMetadata = {
    isPublic: finalIsPublic,
    isOptionalPublic,
    roles,
  };

  decorators.push(SetMetadata(AUTH_METADATA_KEY, authMetadata));

  // Public이 아니거나 OptionalPublic인 경우 통합 가드 적용
  if (!finalIsPublic || isOptionalPublic) {
    // 사용자 요청 → Controller → @Auth 데코레이터 → AuthGuard → Passport → JwtStrategy → validate() → req.user
    decorators.push(UseGuards(AuthGuard));
    // Swagger UI에서 Bearer 토큰 인증 지원
    // Public이 아닌 모든 엔드포인트(인증 필요 또는 선택적 인증)에서 토큰 입력 가능하도록
    decorators.push(ApiBearerAuth("JWT-auth"));
  }

  return applyDecorators(...decorators);
}
