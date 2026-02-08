import { Module } from "@nestjs/common";
import { ReviewService } from "@apps/backend/modules/review/review.service";
import { ReviewDataService } from "@apps/backend/modules/review/services/review.service";
import { DatabaseModule } from "@apps/backend/infra/database/database.module";

/**
 * 후기 관련 모듈
 */
@Module({
  imports: [DatabaseModule],
  providers: [ReviewService, ReviewDataService],
  exports: [ReviewService],
})
export class ReviewModule {}
