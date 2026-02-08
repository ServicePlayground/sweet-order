import { Module } from "@nestjs/common";
import { UserAuthController } from "@apps/backend/apis/user/controllers/auth.controller";
import { UserProductController } from "@apps/backend/apis/user/controllers/product.controller";
import { UserUploadController } from "@apps/backend/apis/user/controllers/upload.controller";
import { UserStoreController } from "@apps/backend/apis/user/controllers/store.controller";
import { UserChatController } from "@apps/backend/apis/user/controllers/chat.controller";
import { AuthModule } from "@apps/backend/modules/auth/auth.module";
import { ProductModule } from "@apps/backend/modules/product/product.module";
import { UploadModule } from "@apps/backend/modules/upload/upload.module";
import { StoreModule } from "@apps/backend/modules/store/store.module";
import { ChatModule } from "@apps/backend/modules/chat/chat.module";
import { FeedModule } from "@apps/backend/modules/feed/feed.module";
import { UserFeedController } from "@apps/backend/apis/user/controllers/feed.controller";
import { ReviewModule } from "@apps/backend/modules/review/review.module";
import { UserReviewController } from "@apps/backend/apis/user/controllers/review.controller";
import { LikeModule } from "@apps/backend/modules/like/like.module";
import { UserLikeController } from "@apps/backend/apis/user/controllers/like.controller";

/**
 * User API 모듈
 *
 * User 관련 API를 제공합니다.
 */

@Module({
  imports: [
    UploadModule,
    AuthModule,
    ProductModule,
    StoreModule,
    ChatModule,
    FeedModule,
    ReviewModule,
    LikeModule,
  ],
  controllers: [
    UserUploadController,
    UserAuthController,
    UserProductController,
    UserStoreController,
    UserChatController,
    UserFeedController,
    UserReviewController,
    UserLikeController,
  ],
})
export class UserApiModule {}
