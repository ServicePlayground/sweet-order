import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR, APP_FILTER } from "@nestjs/core";
import { DatabaseModule } from "@web-user/backend/database/database.module";
import { AuthModule } from "@web-user/backend/modules/auth/auth.module";
import { SuccessResponseInterceptor } from "@web-user/backend/common/interceptors/success-response.interceptor";
import { ErrorResponseInterceptor } from "@web-user/backend/common/interceptors/error-response.interceptor";

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

    // 인증 모듈
    AuthModule,

    // 향후 추가될 모듈들:
    // - UserModule (사용자 관리)
    // - OrderModule (주문 관리)
    // - ProductModule (상품 관리)
  ],
  controllers: [],
  providers: [
    // 전역 Success Response Interceptor 등록 // 성공적인 응답을 통일된 형태로 변환
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },
    // 전역 Error Response Interceptor 등록 // 예외 처리를 통일된 형태로 처리
    {
      provide: APP_FILTER,
      useClass: ErrorResponseInterceptor,
    },
  ],
})
export class AppModule {}
