import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { HealthService } from "./health.service";
import { HealthResponseDto } from "./dto/health-response.dto";
import { ApiResponse } from "@web-user/backend/common/decorators/api-response.decorator";

/**
 * 헬스 체크 컨트롤러
 *
 * 주요 기능:
 * - 서버 상태 확인 API 제공
 * - 서비스 가용성 모니터링
 * - 로드 밸런서 헬스 체크 지원
 */
@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * 서버 상태 확인 API
   * GET /v1/health
   *
   * @returns 서버 상태 정보 (상태, 메시지, 타임스탬프, 서비스명)
   */
  @Get()
  @ApiOperation({
    summary: "서버 상태 확인",
    description: "서버의 현재 상태를 확인합니다. 로드 밸런서나 모니터링 시스템에서 사용됩니다.",
  })
  @ApiResponse({
    success: true,
    status: 200,
    description: "서버가 정상 작동 중",
    type: HealthResponseDto,
  })
  getHealth(): HealthResponseDto {
    return this.healthService.getHealth();
  }
}
