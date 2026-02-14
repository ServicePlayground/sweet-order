import { Module } from "@nestjs/common";
import { StoreService } from "@apps/backend/modules/store/store.service";
import { StoreCreateService } from "@apps/backend/modules/store/services/store-create.service";
import { StoreListService } from "@apps/backend/modules/store/services/store-list.service";
import { StoreUpdateService } from "@apps/backend/modules/store/services/store-update.service";
import { BusinessModule } from "@apps/backend/modules/business/business.module";
import { DatabaseModule } from "@apps/backend/infra/database/database.module";
import { LikeModule } from "@apps/backend/modules/like/like.module";

/**
 * 스토어 관련 모듈
 */
@Module({
  imports: [BusinessModule, DatabaseModule, LikeModule],
  providers: [StoreService, StoreCreateService, StoreListService, StoreUpdateService],
  exports: [StoreService, StoreCreateService, StoreUpdateService, StoreListService],
})
export class StoreModule {}
