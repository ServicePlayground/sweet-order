import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  // JSON 형태로 서버 상태 정보를 응답
  res.json({
    status: "ok", // 서버 상태 (정상: "ok", 비정상: "error")
    message: "Web User Backend is healthy", // 서버 상태에 대한 설명 메시지
    timestamp: new Date().toISOString(), // 현재 시간 (ISO 8601 형식)
    service: "web-user-backend", // 서비스 식별자 (어떤 서비스인지 구분)
  });
});

export { router as healthRouter };
