import { Module } from "@nestjs/common";
import { ProductModule } from "@apps/backend/modules/product/product.module";
import { SellerProductController } from "./controllers/product.controller";
import { BusinessModule } from "@apps/backend/modules/business/business.module";
import { SellerBusinessController } from "./controllers/business.controller";

/**
 * Seller API 모듈
 *
 * Seller 관련 API를 제공합니다.
 */
@Module({
  imports: [ProductModule, BusinessModule],
  controllers: [SellerProductController, SellerBusinessController],
})
export class SellerApiModule {}
