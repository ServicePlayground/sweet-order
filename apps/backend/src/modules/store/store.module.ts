import { Module } from "@nestjs/common";
import { StoreService } from "@apps/backend/modules/store/store.service";
import { StoreCreationService } from "@apps/backend/modules/store/services/store-creation.service";
import { StoreListService } from "@apps/backend/modules/store/services/store-list.service";
import { BusinessModule } from "@apps/backend/modules/business/business.module";
import { DatabaseModule } from "@apps/backend/infra/database/database.module";

/**
 * 스토어 관련 모듈
 */
@Module({
  imports: [BusinessModule, DatabaseModule],
  providers: [StoreService, StoreCreationService, StoreListService],
  exports: [StoreService, StoreCreationService, StoreListService],
})
export class StoreModule {}
