import { Module } from "@nestjs/common";
import { UserAuthController } from "@apps/backend/apis/user/controllers/auth.controller";
import { UserProductController } from "@apps/backend/apis/user/controllers/product.controller";
import { UserUploadController } from "@apps/backend/apis/user/controllers/upload.controller";
import { AuthModule } from "@apps/backend/modules/auth/auth.module";
import { ProductModule } from "@apps/backend/modules/product/product.module";
import { UploadModule } from "@apps/backend/modules/upload/upload.module";

/**
 * User API 모듈
 *
 * User 관련 API를 제공합니다.
 */

@Module({
  imports: [UploadModule, AuthModule, ProductModule],
  controllers: [UserUploadController, UserAuthController, UserProductController],
})
export class UserApiModule {}
