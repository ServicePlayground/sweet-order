import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import morgan from "morgan";
import { AppModule } from "@web-user/backend/app.module";
import { ConfigService } from "@nestjs/config";
import { API_PREFIX, SERVICE_INFO } from "@web-user/backend/common/constants/app.constants";

/**
 * NestJS 애플리케이션의 진입점
 */
async function bootstrap(): Promise<void> {
  // NestJS 애플리케이션 메인 인스턴스 생성 (AppModule을 사용하여 모든 모듈을 포함하고 있음)
  const app = await NestFactory.create(AppModule);

  // 로깅 인스턴스 생성
  const logger = new Logger("서버시작");

  // ConfigService 인스턴스 생성 (.env 환경 변수에 저장된 설정값들 가져올 수 있음)
  const configService = app.get(ConfigService);

  // 포트와 환경 변수 가져오기
  const port = configService.get("PORT");
  const nodeEnv = configService.get("NODE_ENV");

  // CORS 설정
  app.enableCors({
    origin: configService.get("CORS_ORIGIN"),
    credentials: configService.get("CORS_CREDENTIALS") === "true",
    methods: configService.get("CORS_METHODS")?.split(","),
    allowedHeaders: configService.get("CORS_ALLOWED_HEADERS")?.split(","),
    maxAge: parseInt(configService.get("CORS_MAX_AGE")?.toString(), 10),
  });

  // 보안 헤더 설정
  app.use(helmet());

  // HTTP 요청 로깅
  app.use(morgan("combined"));

  // 전역 유효성 검사 파이프 설정
  // class-validator를 사용하여 DTO 유효성 검사 자동화
  // 클라이언트가 API 요청 → ValidationPipe가 DTO 검증 → 유효하지 않으면 에러 반환 → 유효하면 컨트롤러로 전달
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 에러 발생
      transform: true, // 자동 타입 변환 (string -> number 등)
    }),
  );

  // 전역 접두사 설정 (모든 API 경로에 /v1 접두사 추가)
  // 호출 순서 중요 (설정 순서에 따라 적용되는 순서가 다름)
  app.setGlobalPrefix(API_PREFIX);

  // Swagger API 문서 설정
  // 개발/스테이징/상용 어떻게 분기처리해야할지 확인필요 (상용에서 위험할 수 있음)
  if (nodeEnv === "development") {
    const config = new DocumentBuilder()
      .setTitle(SERVICE_INFO.DESCRIPTION)
      .setDescription(`${SERVICE_INFO.DESCRIPTION} 문서`)
      .setVersion(SERVICE_INFO.VERSION)
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${API_PREFIX}/docs`, app, document);
  }

  // 서버 시작
  await app.listen(port);

  logger.log(`server is running on port ${port}`);
  logger.log(`Environment: ${nodeEnv}`);
  if (nodeEnv === "development") {
    logger.log(`API Documentation: http://localhost:${port}${API_PREFIX}/docs`);
  }
}

bootstrap();
