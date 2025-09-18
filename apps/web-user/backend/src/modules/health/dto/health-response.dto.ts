import { ApiProperty } from "@nestjs/swagger";

/**
 * 헬스 체크 응답 DTO
 *
 * 주요 기능:
 * - API 응답 구조 표준화
 * - Swagger 문서 자동 생성
 * - 타입 안전성 보장
 */
export class HealthResponseDto {
  @ApiProperty({
    description: '서버 상태 (정상: "ok", 비정상: "error")',
    example: "ok",
    enum: ["ok", "error"],
  })
  status: "ok" | "error";

  @ApiProperty({
    description: "서버 상태에 대한 설명 메시지",
    example: "Sweet Order 웹 사용자 백엔드 API is healthy",
  })
  message: string;

  @ApiProperty({
    description: "현재 시간 (ISO 8601 형식)",
    example: "2024-01-15T10:30:00.000Z",
  })
  timestamp: string;

  @ApiProperty({
    description: "서비스 식별자 (어떤 서비스인지 구분)",
    example: "web-user-backend",
  })
  service: string;
}
