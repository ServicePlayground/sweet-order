import { Module } from "@nestjs/common";
import { ProductController } from "@web-user/backend/modules/product/product.controller";
import { ProductService } from "@web-user/backend/modules/product/product.service";
import { ProductService as ProductDataService } from "@web-user/backend/modules/product/services/product.service";
import { DatabaseModule } from "@web-user/backend/database/database.module";

/**
 * 상품 모듈
 * 사용자용 상품 조회, 검색, 필터링 등의 기능을 제공합니다.
 */
@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [ProductService, ProductDataService],
  exports: [ProductService],
})
export class ProductModule {}
