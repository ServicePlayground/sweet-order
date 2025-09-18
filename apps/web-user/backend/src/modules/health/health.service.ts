import { Injectable } from "@nestjs/common";
import { HealthResponseDto } from "./dto/health-response.dto";
import { SERVICE_INFO } from "@web-user/backend/config/constants/app.constants";

/**
 * 헬스 체크 서비스
 *
 * 주요 기능:
 * - 서버 상태 정보 생성
 * - 향후 데이터베이스 연결 상태, 외부 서비스 상태 등 확장 가능
 */
@Injectable()
export class HealthService {
  /**
   * 서버 상태 정보를 반환합니다.
   * @returns HealthResponseDto - 서버 상태 정보 객체
   */
  getHealth(): HealthResponseDto {
    return {
      status: "ok", // 서버 상태 (정상: "ok", 비정상: "error")
      message: `${SERVICE_INFO.DESCRIPTION} is healthy`, // 서버 상태에 대한 설명 메시지
      timestamp: new Date().toISOString(), // 현재 시간 (ISO 8601 형식)
      service: SERVICE_INFO.NAME, // 서비스 식별자 (어떤 서비스인지 구분)
    };
  }

  /**
   * 향후 확장 가능한 메서드들:
   *
   * - checkDatabase(): Promise<boolean> - 데이터베이스 연결 상태 확인
   * - checkExternalServices(): Promise<boolean> - 외부 서비스 연결 상태 확인
   * - getSystemInfo(): SystemInfo - 시스템 리소스 정보 (CPU, 메모리 등)
   * - getDetailedHealth(): DetailedHealthResponse - 상세한 헬스 체크 정보
   */
}
