import { Module } from "@nestjs/common";
import { FeedService } from "@apps/backend/modules/feed/services/feed.service";
import { DatabaseModule } from "@apps/backend/infra/database/database.module";

/**
 * 피드 관련 모듈
 */
@Module({
  imports: [DatabaseModule],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}
