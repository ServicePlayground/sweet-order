import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

/**
 * 헬스 체크 모듈
 *
 * 주요 기능:
 * - 헬스 체크 컨트롤러와 서비스를 하나의 모듈로 구성
 * - 의존성 주입을 통한 느슨한 결합
 * - 모듈화를 통한 코드 재사용성 향상
 */
@Module({
  controllers: [HealthController], // 헬스 체크 컨트롤러 등록
  providers: [HealthService], // 헬스 체크 서비스 등록
  exports: [HealthService], // 다른 모듈에서 HealthService 사용 가능하도록 export
})
export class HealthModule {}
