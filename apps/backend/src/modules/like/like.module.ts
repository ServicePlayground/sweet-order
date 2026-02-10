import { Module } from "@nestjs/common";
import { DatabaseModule } from "@apps/backend/infra/database/database.module";
import { LikeService } from "@apps/backend/modules/like/like.service";
import { LikeDataService } from "@apps/backend/modules/like/services/like.service";

/**
 * 좋아요 모듈
 * 상품 및 스토어 좋아요 관련 기능을 제공합니다.
 */
@Module({
  imports: [DatabaseModule],
  providers: [LikeService, LikeDataService],
  exports: [LikeService, LikeDataService],
})
export class LikeModule {}
