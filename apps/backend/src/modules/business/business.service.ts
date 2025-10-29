import { Injectable } from "@nestjs/common";
import { BusinessValidationRequestDto } from "@apps/backend/modules/business/dto/business-request.dto";
import { NtsApiService } from "@apps/backend/modules/business/services/nts-api.service";

/**
 * 사업 서비스
 *
 * 모든 사업 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * NtsApiService를 조합하여 사용합니다.
 */
@Injectable()
export class BusinessService {
  constructor(
    private readonly ntsApiService: NtsApiService,
  ) {}

  /**
   * 사업자등록번호 진위확인
   */
  async verifyBusinessRegistration(
    validationDto: BusinessValidationRequestDto,
  ) {
    return this.ntsApiService.verifyBusinessRegistration(validationDto);
  }
}
