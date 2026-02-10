import { Module } from "@nestjs/common";
import { FeedService } from "@apps/backend/modules/feed/feed.service";
import { FeedCreateService } from "@apps/backend/modules/feed/services/feed-create.service";
import { FeedUpdateService } from "@apps/backend/modules/feed/services/feed-update.service";
import { FeedDeleteService } from "@apps/backend/modules/feed/services/feed-delete.service";
import { FeedListService } from "@apps/backend/modules/feed/services/feed-list.service";
import { FeedDetailService } from "@apps/backend/modules/feed/services/feed-detail.service";
import { DatabaseModule } from "@apps/backend/infra/database/database.module";

/**
 * 피드 관련 모듈
 */
@Module({
  imports: [DatabaseModule],
  providers: [
    FeedService,
    FeedCreateService,
    FeedUpdateService,
    FeedDeleteService,
    FeedListService,
    FeedDetailService,
  ],
  exports: [FeedService],
})
export class FeedModule {}
