import { Module } from "@nestjs/common";
import { StoreService } from "@apps/backend/modules/store/store.service";
import { StoreCreationService } from "@apps/backend/modules/store/services/store-creation.service";
import { StoreListService } from "@apps/backend/modules/store/services/store-list.service";
import { StoreLikeService } from "@apps/backend/modules/store/services/store-like.service";
import { StoreReviewService } from "@apps/backend/modules/store/services/store-review.service";
import { BusinessModule } from "@apps/backend/modules/business/business.module";
import { DatabaseModule } from "@apps/backend/infra/database/database.module";

/**
 * 스토어 관련 모듈
 */
@Module({
  imports: [BusinessModule, DatabaseModule],
  providers: [
    StoreService,
    StoreCreationService,
    StoreListService,
    StoreLikeService,
    StoreReviewService,
  ],
  exports: [
    StoreService,
    StoreCreationService,
    StoreListService,
    StoreLikeService,
    StoreReviewService,
  ],
})
export class StoreModule {}
