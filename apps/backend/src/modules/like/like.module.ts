import { Module } from "@nestjs/common";
import { DatabaseModule } from "@apps/backend/infra/database/database.module";
import { LikeService } from "@apps/backend/modules/like/like.service";
import { LikeProductCreateService } from "@apps/backend/modules/like/services/like-product-create.service";
import { LikeProductDeleteService } from "@apps/backend/modules/like/services/like-product-delete.service";
import { LikeProductDetailService } from "@apps/backend/modules/like/services/like-product-detail.service";
import { LikeStoreCreateService } from "@apps/backend/modules/like/services/like-store-create.service";
import { LikeStoreDeleteService } from "@apps/backend/modules/like/services/like-store-delete.service";
import { LikeStoreDetailService } from "@apps/backend/modules/like/services/like-store-detail.service";
import { LikeUserListService } from "@apps/backend/modules/like/services/like-user-list.service";

/**
 * 좋아요 모듈
 * 상품 및 스토어 좋아요 관련 기능을 제공합니다.
 */
@Module({
  imports: [DatabaseModule],
  providers: [
    LikeService,
    LikeProductCreateService,
    LikeProductDeleteService,
    LikeProductDetailService,
    LikeStoreCreateService,
    LikeStoreDeleteService,
    LikeStoreDetailService,
    LikeUserListService,
  ],
  exports: [LikeService, LikeProductDetailService, LikeStoreDetailService],
})
export class LikeModule {}
