import { Injectable } from "@nestjs/common";
import { ProductService as ProductDataService } from "@apps/backend/modules/product/services/product.service";
import {
  GetProductsRequestDto,
  GetSellerProductsRequestDto,
} from "@apps/backend/modules/product/dto/product-list.dto";
import { CreateProductRequestDto } from "@apps/backend/modules/product/dto/product-create.dto";
import { UpdateProductRequestDto } from "@apps/backend/modules/product/dto/product-update.dto";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";

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
   * 상품 목록 조회 (사용자용)
   */
  async getProductsForUser(query: GetProductsRequestDto, user?: JwtVerifiedPayload) {
    return this.productDataService.getProductsForUser(query, user);
  }

  /**
   * 상품 상세 조회 (사용자용)
   */
  async getProductDetailForUser(id: string, user?: JwtVerifiedPayload) {
    return this.productDataService.getProductDetailForUser(id, user);
  }

  /**
   * 상품 목록 조회 (판매자용)
   */
  async getProductsForSeller(query: GetSellerProductsRequestDto, user: JwtVerifiedPayload) {
    return this.productDataService.getProductsForSeller(query, user);
  }

  /**
   * 상품 상세 조회 (판매자용)
   */
  async getProductDetailForSeller(id: string, user: JwtVerifiedPayload) {
    return this.productDataService.getProductDetailForSeller(id, user);
  }

  /**
   * 상품 등록 (판매자용)
   */
  async createProductForSeller(
    createProductDto: CreateProductRequestDto,
    user: JwtVerifiedPayload,
  ) {
    return this.productDataService.createProductForSeller(createProductDto, user);
  }

  /**
   * 상품 수정 (판매자용)
   */
  async updateProductForSeller(
    id: string,
    updateProductDto: UpdateProductRequestDto,
    user: JwtVerifiedPayload,
  ) {
    return this.productDataService.updateProductForSeller(id, updateProductDto, user);
  }

  /**
   * 상품 삭제 (판매자용)
   */
  async deleteProductForSeller(id: string, user: JwtVerifiedPayload) {
    this.productDataService.deleteProductForSeller(id, user);
  }
}
