import { Module } from "@nestjs/common";
import { ProductModule } from "@apps/backend/modules/product/product.module";
import { SellerProductController } from "./controllers/product.controller";
import { BusinessModule } from "@apps/backend/modules/business/business.module";
import { SellerBusinessController } from "./controllers/business.controller";
import { StoreModule } from "@apps/backend/modules/store/store.module";
import { SellerStoreController } from "@apps/backend/apis/seller/controllers/store.controller";

/**
 * Seller API 모듈
 *
 * Seller 관련 API를 제공합니다.
 */
@Module({
  imports: [ProductModule, BusinessModule, StoreModule],
  controllers: [SellerProductController, SellerBusinessController, SellerStoreController],
})
export class SellerApiModule {}
