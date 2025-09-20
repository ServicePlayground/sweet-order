import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthModule } from "@web-user/backend/modules/health/health.module";
import { DatabaseModule } from "@web-user/backend/database/database.module";

/**
 * NestJS 애플리케이션의 루트 모듈
 * 모든 기능 모듈들을 통합하는 메인 모듈
 */
@Module({
  imports: [
    // 환경 변수 설정 모듈
    ConfigModule.forRoot({
      isGlobal: true, // 전역에서 사용 가능하도록 설정
      envFilePath: [
        `.env.${process.env.NODE_ENV}`, // 환경별 .env 파일
      ],
    }),

    // 데이터베이스 모듈
    DatabaseModule,

    // 헬스 체크 모듈
    HealthModule,

    // 향후 추가될 모듈들:
    // - AuthModule (인증/인가)
    // - UserModule (사용자 관리)
    // - OrderModule (주문 관리)
    // - ProductModule (상품 관리)
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
