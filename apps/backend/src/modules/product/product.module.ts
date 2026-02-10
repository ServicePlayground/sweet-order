import { Module } from "@nestjs/common";
import { ProductService } from "@apps/backend/modules/product/product.service";
import { ProductService as ProductDataService } from "@apps/backend/modules/product/services/product.service";
import { LikeModule } from "@apps/backend/modules/like/like.module";

/**
 * 상품 모듈
 * 사용자용 상품 조회, 검색, 필터링 등의 기능을 제공합니다.
 */
@Module({
  imports: [LikeModule],
  providers: [ProductService, ProductDataService],
  exports: [ProductService],
})
export class ProductModule {}
