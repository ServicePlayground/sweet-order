import { Injectable } from "@nestjs/common";
import { ProductService as ProductDataService } from "@web-user/backend/modules/product/services/product.service";
import { GetProductsRequestDto } from "@web-user/backend/modules/product/dto/product-request.dto";
import { JwtVerifiedPayload } from "@web-user/backend/common/types/auth.types";

/**
 * 상품 서비스
 *
 * 모든 상품 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * ProductDataService를 조합하여 사용합니다.
 */
@Injectable()
export class ProductService {
  constructor(private readonly productDataService: ProductDataService) {}

  /**
   * 상품 목록 조회 (필터링, 정렬, 무한 스크롤 지원)
   */
  async getProducts(query: GetProductsRequestDto, user?: JwtVerifiedPayload) {
    return this.productDataService.getProducts(query, user);
  }

  /**
   * 상품 상세 조회
   */
  async getProductDetail(id: string, user?: JwtVerifiedPayload) {
    return this.productDataService.getProductDetail(id, user);
  }
}
