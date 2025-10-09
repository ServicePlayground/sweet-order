import { Module } from "@nestjs/common";
import { ProductModule } from "@apps/backend/modules/product/product.module";
import { SellerProductController } from "./controllers/product.controller";

/**
 * Seller API 모듈
 *
 * Seller 관련 API를 제공합니다.
 * SELLER와 ADMIN 역할만 접근 가능합니다.
 * 통합 인증 데코레이터가 자동으로 적용됩니다.
 */
@Module({
  imports: [ProductModule],
  controllers: [SellerProductController],
})
export class SellerApiModule {}
