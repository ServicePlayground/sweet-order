import { Module } from "@nestjs/common";

/**
 * Admin API 모듈
 *
 * Admin 관련 API를 제공합니다.
 * ADMIN 역할만 접근 가능합니다.
 * 통합 인증 데코레이터가 자동으로 적용됩니다.
 */
@Module({
  controllers: [],
})
export class AdminApiModule {}
