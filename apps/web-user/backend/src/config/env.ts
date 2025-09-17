import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ES 모듈에서 __dirname 사용을 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경 변수 로드 (환경별 .env.development, .env.staging, .env.production 파일)
const nodeEnv = process.env.NODE_ENV || "development";
const envFile = `.env.${nodeEnv}`;
const envPath = path.resolve(__dirname, "..", "..", envFile);

dotenv.config({
  path: envPath,
});

export const config = {
  // 포트
  port: process.env.PORT || "3000",

  // 환경 변수
  nodeEnv: process.env.NODE_ENV || "development",

  // CORS
  cors: {
    // 허용할 도메인
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",

    // 쿠키, 인증 헤더 등 자격 증명 정보를 포함한 요청 허용 여부
    // true: Authorization 헤더, 쿠키 등을 포함한 요청 허용
    credentials: process.env.CORS_CREDENTIALS === "true" || true,

    // 허용할 HTTP 메서드 목록
    methods: process.env.CORS_METHODS?.split(",") || [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    // 클라이언트가 요청에 포함할 수 있는 헤더 목록
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(",") || [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],

    // Preflight 요청(OPTIONS)의 요청 캐시 시간 : 86400 = 24시간, 3600 = 1시간
    // 1. 브라우저가 OPTIONS 요청을 보냄
    // 2. 서버가 CORS 정책과 함께 maxAge 시간을 응답
    // 3. 브라우저가 이 정보를 maxAge 시간 동안 캐시
    // 4. 후속 요청: 같은 도메인에서 같은 조건의 요청은 OPTIONS 없이 바로 실행
    maxAge: process.env.CORS_MAX_AGE ? parseInt(process.env.CORS_MAX_AGE, 10) : 3600,
  },

  // // Database (향후 Prisma 설정용)
  // database: {
  //   url: process.env.DATABASE_URL || "",
  // },

  // // JWT (향후 인증용)
  // jwt: {
  //   secret: process.env.JWT_SECRET || "your-secret-key",
  //   expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  // },

  // // Logging
  // logging: {
  //   level: process.env.LOG_LEVEL || "info",
  // },
} as const;
