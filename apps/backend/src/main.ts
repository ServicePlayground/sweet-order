import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
import morgan from "morgan";
import * as express from "express";
import { AppModule } from "@apps/backend/app.module";
import { API_PREFIX } from "@apps/backend/common/constants/app.constants";
import { SellerApiModule } from "@apps/backend/apis/seller/seller-api.module";
import { UserApiModule } from "@apps/backend/apis/user/user-api.module";
import { AdminApiModule } from "@apps/backend/apis/admin/admin-api.module";
import {
  adminSwaggerConfig,
  sellerSwaggerConfig,
  userSwaggerConfig,
} from "@apps/backend/config/swagger.config";
import { USER_ROLES } from "@apps/backend/modules/auth/constants/auth.constants";
import { loadSecretsFromEnv } from "@apps/backend/common/utils/loadSecretsFromEnv";
import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";

/**
 * 데이터베이스 마이그레이션 실행
 */
async function runMigration(): Promise<void> {
  try {
    // 배포 환경에서는 Docker 컨테이너의 /app 디렉토리에서 실행
    const projectRoot = "/app";

    console.log(`📁 Running migration from: ${projectRoot}`);
    console.log(`📁 Current working directory: ${process.cwd()}`);
    console.log(`📁 __dirname: ${__dirname}`);

    // package.json 파일이 존재하는지 확인
    const packageJsonPath = path.join(projectRoot, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      console.error(`❌ package.json not found at: ${packageJsonPath}`);
      console.log(`📁 Available files in ${projectRoot}:`, fs.readdirSync(projectRoot));
      throw new Error(`package.json not found at ${projectRoot}`);
    }

    console.log(`✅ Found package.json at: ${packageJsonPath}`);

    execSync("yarn run db:migrate:deploy", {
      stdio: "inherit",
      cwd: projectRoot,
    });
    console.log("✅ Database migration completed successfully");
  } catch (error) {
    console.error("❌ Database migration failed:", error);
    process.exit(1);
  }
}

/**
 * NestJS 애플리케이션의 진입점
 */
async function bootstrap(): Promise<void> {
  // 배포 환경(staging, production)에서는 AWS App Runner(AWS Secrets Manager)에서 환경변수 추가하여, 런타임시 주입하도록 함(자세한 사항은 환경변수 - 가이드.md 참고)
  if (process.env.NODE_ENV !== "development") {
    loadSecretsFromEnv();

    // 배포 환경에서만 런타임 초기에 마이그레이션(yarn run db:migrate:deploy) 실행(환경변수가 필요하기 때문에 런타임시 실행)
    // 로컬 개발환경에서는 개발자가 직접 마이그레이션(yarn db:migrate:dev) 관리
    await runMigration();
  }

  // NestJS 애플리케이션 메인 인스턴스 생성 (AppModule을 사용하여 모든 모듈을 포함하고 있음)
  const app = await NestFactory.create(AppModule);

  // 로깅 인스턴스 생성
  const logger = new Logger("서버시작");

  // ConfigService 인스턴스 생성 (.env 환경 변수에 저장된 설정값들 가져올 수 있음)
  const configService = app.get(ConfigService);

  // 포트와 환경 변수 가져오기
  const port = configService.get("PORT");
  const nodeEnv = configService.get("NODE_ENV");

  // Health check (CORS 제외, global prefix 제외, interceptor/guard 등 미적용)
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.getInstance().get("/health", (_req: any, res: any) => {
    res.status(200).send("OK");
  });

  // CORS 설정
  app.enableCors({
    origin: configService.get("CORS_ORIGIN"),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    maxAge: 86400,
  });

  // 보안 헤더 설정
  app.use(helmet());

  // HTTP 요청 로깅 - 상용 환경에서는 비활성화
  if (nodeEnv !== "production") {
    app.use(morgan("combined"));
  }

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

  // Swagger 3-way split (development와 staging 환경에서만 활성화)
  if (nodeEnv !== "production") {
    // 스웨거 Basic Auth 미들웨어 설정
    const swaggerUsername = configService.get("SWAGGER_USERNAME");
    const swaggerPassword = configService.get("SWAGGER_PASSWORD");

    // 스웨거 경로에 Basic Auth 적용
    app.use(
      `${API_PREFIX}/docs`,
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const auth = req.headers.authorization;

        if (!auth || !auth.startsWith("Basic ")) {
          res.setHeader("WWW-Authenticate", 'Basic realm="Swagger Documentation"');
          return res.status(401).send("Authentication required");
        }

        const credentials = Buffer.from(auth.slice(6), "base64").toString();
        const [username, password] = credentials.split(":");

        if (username === swaggerUsername && password === swaggerPassword) {
          return next();
        }

        res.setHeader("WWW-Authenticate", 'Basic realm="Swagger Documentation"');
        return res.status(401).send("Invalid credentials");
      },
    );

    const userDoc = SwaggerModule.createDocument(app, userSwaggerConfig, {
      include: [UserApiModule],
    });
    SwaggerModule.setup(`${API_PREFIX}/docs/${USER_ROLES.USER}`, app, userDoc);

    const sellerDoc = SwaggerModule.createDocument(app, sellerSwaggerConfig, {
      include: [SellerApiModule],
    });
    SwaggerModule.setup(`${API_PREFIX}/docs/${USER_ROLES.SELLER}`, app, sellerDoc);

    const adminDoc = SwaggerModule.createDocument(app, adminSwaggerConfig, {
      include: [AdminApiModule],
    });
    SwaggerModule.setup(`${API_PREFIX}/docs/${USER_ROLES.ADMIN}`, app, adminDoc);
  }

  // 서버 시작
  await app.listen(Number(port));

  logger.log(`server is running on port ${port}`);
  logger.log(`Environment: ${nodeEnv}`);
}

bootstrap();
