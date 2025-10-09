import { Module } from "@nestjs/common";
import { UserAuthController } from "@apps/backend/apis/user/controllers/auth.controller";
import { UserProductController } from "@apps/backend/apis/user/controllers/product.controller";
import { AuthModule } from "@apps/backend/modules/auth/auth.module";
import { ProductModule } from "@apps/backend/modules/product/product.module";

/**
 * User API 모듈
 *
 * User 관련 API를 제공합니다.
 * USER 역할만 접근 가능합니다.
 * 통합 인증 데코레이터가 자동으로 적용됩니다.
 */

@Module({
  imports: [AuthModule, ProductModule],
  controllers: [UserAuthController, UserProductController],
})
export class UserApiModule {}
