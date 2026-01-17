import { Injectable } from "@nestjs/common";
import { ProductService as ProductDataService } from "@apps/backend/modules/product/services/product.service";
import { ProductLikeService } from "@apps/backend/modules/product/services/product-like.service";
import {
  GetProductsRequestDto,
  GetSellerProductsRequestDto,
  CreateProductRequestDto,
  UpdateProductRequestDto,
} from "@apps/backend/modules/product/dto/product-request.dto";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";

/**
 * 상품 서비스
 *
 * 모든 상품 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * ProductDataService를 조합하여 사용합니다.
 */
@Injectable()
export class ProductService {
  constructor(
    private readonly productDataService: ProductDataService,
    private readonly productLikeService: ProductLikeService,
  ) {}

  /**
   * 상품 목록 조회 (필터링, 정렬, 무한 스크롤 지원)
   */
  async getProducts(query: GetProductsRequestDto) {
    return this.productDataService.getProducts(query);
  }

  /**
   * 상품 상세 조회
   */
  async getProductDetail(id: string) {
    return this.productDataService.getProductDetail(id);
  }

  /**
   * (판매자용) 상품 목록 조회
   */
  async getSellerProducts(query: GetSellerProductsRequestDto, user: JwtVerifiedPayload) {
    return this.productDataService.getSellerProducts(query, user);
  }

  /**
   * (판매자용) 상품 상세 조회
   */
  async getSellerProductDetail(id: string, user: JwtVerifiedPayload) {
    return this.productDataService.getSellerProductDetail(id, user);
  }

  /**
   * (판매자용) 상품 등록
   */
  async createProduct(createProductDto: CreateProductRequestDto, user: JwtVerifiedPayload) {
    return this.productDataService.createProduct(createProductDto, user);
  }

  /**
   * (판매자용) 상품 수정
   */
  async updateProduct(
    id: string,
    updateProductDto: UpdateProductRequestDto,
    user: JwtVerifiedPayload,
  ) {
    return this.productDataService.updateProduct(id, updateProductDto, user);
  }

  /**
   * (판매자용) 상품 삭제
   */
  async deleteProduct(id: string, user: JwtVerifiedPayload) {
    this.productDataService.deleteProduct(id, user);
  }

  /**
   * 상품 좋아요 추가
   */
  async addProductLike(userId: string, productId: string) {
    return this.productLikeService.addProductLike(userId, productId);
  }

  /**
   * 상품 좋아요 삭제
   */
  async removeProductLike(userId: string, productId: string) {
    return this.productLikeService.removeProductLike(userId, productId);
  }

  /**
   * 상품 좋아요 여부 확인
   */
  async isLiked(userId: string, productId: string): Promise<boolean> {
    return this.productLikeService.isLiked(userId, productId);
  }
}
