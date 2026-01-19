import { Module } from "@nestjs/common";
import { ProductService } from "@apps/backend/modules/product/product.service";
import { ProductService as ProductDataService } from "@apps/backend/modules/product/services/product.service";
import { ProductLikeService } from "@apps/backend/modules/product/services/product-like.service";
import { ProductReviewService } from "@apps/backend/modules/product/services/product-review.service";

/**
 * 상품 모듈
 * 사용자용 상품 조회, 검색, 필터링 등의 기능을 제공합니다.
 */
@Module({
  imports: [],
  providers: [ProductService, ProductDataService, ProductLikeService, ProductReviewService],
  exports: [ProductService],
})
export class ProductModule {}
