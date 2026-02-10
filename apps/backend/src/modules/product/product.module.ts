import { Module } from "@nestjs/common";
import { ProductService } from "@apps/backend/modules/product/product.service";
import { ProductService as ProductDataService } from "@apps/backend/modules/product/services/product.service";
import { ProductListService } from "@apps/backend/modules/product/services/product-list.service";
import { ProductDetailService } from "@apps/backend/modules/product/services/product-detail.service";
import { ProductCreateService } from "@apps/backend/modules/product/services/product-create.service";
import { ProductUpdateService } from "@apps/backend/modules/product/services/product-update.service";
import { ProductDeleteService } from "@apps/backend/modules/product/services/product-delete.service";
import { LikeModule } from "@apps/backend/modules/like/like.module";

/**
 * 상품 모듈
 * 사용자용 상품 조회, 검색, 필터링 등의 기능을 제공합니다.
 */
@Module({
  imports: [LikeModule],
  providers: [
    ProductService,
    ProductDataService,
    ProductListService,
    ProductDetailService,
    ProductCreateService,
    ProductUpdateService,
    ProductDeleteService,
  ],
  exports: [ProductService],
})
export class ProductModule {}
