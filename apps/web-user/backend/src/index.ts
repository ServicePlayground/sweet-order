import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { healthRouter } from "./routes/health.js";

const app = express();

// 미들웨어 설정
app.use(helmet()); // 보안 헤더 설정
app.use(cors(config.cors)); // CORS 설정
app.use(morgan("combined")); // 로깅
app.use(express.json()); // HTTP 요청의 본문(body)에 포함된 JSON 데이터를 JavaScript 객체로 자동 파싱 // (stringJSON => object) "{"name": "홍길동", "age": 30}" => { name: "홍길동", age: 30 }
app.use(express.urlencoded({ extended: true })); // HTML 폼(Content-Type: application/x-www-form-urlencoded)에서 전송되는 URL 인코딩된 데이터를 JavaScript 객체로 자동 파싱 // (stringURL인코딩 => object) "name=홍길동&age=30" => { name: "홍길동", age: 30 }

// 라우트 설정
app.use("/api/health", healthRouter);

// 에러 핸들링 미들웨어 (이 미들웨어는 반드시 모든 라우트 핸들러 이후에 등록되어야 합니다.)
app.use(errorHandler); // 전역 에러 핸들러 미들웨어

// 서버 시작
app.listen(config.port, () => {
  console.log(`Web User Backend server is running on port ${config.port}`, config.nodeEnv);
});

export default app;
