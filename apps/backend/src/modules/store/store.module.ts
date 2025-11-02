import { Module } from "@nestjs/common";
import { StoreService } from "@apps/backend/modules/store/store.service";
import { StoreCreationService } from "@apps/backend/modules/store/services/store-creation.service";
import { BusinessModule } from "@apps/backend/modules/business/business.module";

/**
 * 스토어 관련 모듈
 */
@Module({
  imports: [BusinessModule],
  providers: [StoreService, StoreCreationService],
  exports: [StoreService, StoreCreationService],
})
export class StoreModule {}
