import { Module } from "@nestjs/common";
import { BusinessService } from "@apps/backend/modules/business/business.service";
import { NtsApiService } from "@apps/backend/modules/business/services/nts-api.service";

/**
 * 사업 관련 모듈
 */
@Module({
  imports: [],
  providers: [BusinessService, NtsApiService],
  exports: [BusinessService, NtsApiService],
})
export class BusinessModule {}
