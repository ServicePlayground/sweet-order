import { Module } from "@nestjs/common";
import { BusinessService } from "@apps/backend/modules/business/business.service";
import { NtsApiService } from "@apps/backend/modules/business/services/nts-api.service";
import { KftcApiService } from "@apps/backend/modules/business/services/kftc-api.service";

/**
 * 사업 관련 모듈
 */
@Module({
  imports: [],
  providers: [BusinessService, NtsApiService, KftcApiService],
  exports: [BusinessService, NtsApiService, KftcApiService],
})
export class BusinessModule {}
