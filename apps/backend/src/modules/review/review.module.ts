import { Module } from "@nestjs/common";
import { ReviewService } from "@apps/backend/modules/review/review.service";
import { ReviewListService } from "@apps/backend/modules/review/services/review-list.service";
import { ReviewDetailService } from "@apps/backend/modules/review/services/review-detail.service";
import { ReviewUserListService } from "@apps/backend/modules/review/services/review-user-list.service";
import { DatabaseModule } from "@apps/backend/infra/database/database.module";

/**
 * 후기 관련 모듈
 */
@Module({
  imports: [DatabaseModule],
  providers: [ReviewService, ReviewListService, ReviewDetailService, ReviewUserListService],
  exports: [ReviewService],
})
export class ReviewModule {}
