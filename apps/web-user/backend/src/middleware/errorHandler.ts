import { Request, Response } from "express";

export interface AppError extends Error {
  statusCode?: number; // HTTP 상태 코드
}

/**
 * 전역 에러 핸들러 미들웨어
 * 이 미들웨어는 반드시 모든 라우트 핸들러 이후에 등록되어야 합니다.
 *
 * 주요 기능:
 * - 에러 로깅 (서버 콘솔에 상세 정보 출력)
 * - 클라이언트에게 일관된 에러 응답 형식 제공
 */
export const errorHandler = (err: AppError, req: Request, res: Response) => {
  // 에러에서 상태 코드 추출 (기본값: 500 Internal Server Error)
  const statusCode = err.statusCode || 500;

  // 에러에서 메시지 추출 (기본값: "Internal Server Error")
  const message = err.message || "Internal Server Error";

  // 서버 콘솔에 에러 정보 로깅 (디버깅 및 모니터링용)
  console.error("Error:", {
    message: err.message, // 에러 메시지
    stack: err.stack, // 스택 트레이스 (에러 발생 위치)
    url: req.url, // 요청 URL
    method: req.method, // HTTP 메서드
    timestamp: new Date().toISOString(), // 에러 발생 시간
  });

  // 클라이언트에게 JSON 형태로 에러 응답 전송
  res.status(statusCode).json({
    success: false,
    error: {
      message, // 에러 메시지
      statusCode, // HTTP 상태 코드
    },
  });
};
