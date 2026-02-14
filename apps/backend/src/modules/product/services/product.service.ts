import { Injectable } from "@nestjs/common";
import {
  GetProductsRequestDto,
  GetSellerProductsRequestDto,
} from "@apps/backend/modules/product/dto/product-list.dto";
import { CreateProductRequestDto } from "@apps/backend/modules/product/dto/product-create.dto";
import { UpdateProductRequestDto } from "@apps/backend/modules/product/dto/product-update.dto";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { ProductListService } from "@apps/backend/modules/product/services/product-list.service";
import { ProductDetailService } from "@apps/backend/modules/product/services/product-detail.service";
import { ProductCreateService } from "@apps/backend/modules/product/services/product-create.service";
import { ProductUpdateService } from "@apps/backend/modules/product/services/product-update.service";
import { ProductDeleteService } from "@apps/backend/modules/product/services/product-delete.service";

/**
 * 상품 서비스
 * 사용자용 상품 조회, 검색, 필터링 등의 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class ProductService {
  constructor(
    private readonly productListService: ProductListService,
    private readonly productDetailService: ProductDetailService,
    private readonly productCreateService: ProductCreateService,
    private readonly productUpdateService: ProductUpdateService,
    private readonly productDeleteService: ProductDeleteService,
  ) {}

  /**
   * 상품 목록 조회 (필터링, 정렬, 무한스크롤 지원)
   * @param query - 조회 조건
   * @param user - 로그인한 사용자 정보 (옵셔널)
   */
  async getProducts(query: GetProductsRequestDto, user?: JwtVerifiedPayload) {
    return this.productListService.getProducts(query, user);
  }

  /**
   * 상품 상세 조회
   * @param id - 상품 ID
   * @param user - 로그인한 사용자 정보 (옵셔널)
   */
  async getProductDetail(id: string, user?: JwtVerifiedPayload) {
    return this.productDetailService.getProductDetail(id, user);
  }

  /**
   * 판매자용 상품 목록 조회 (필터링, 정렬, 무한스크롤 지원)
   * 자신이 소유한 스토어의 상품만 조회합니다.
   */
  async getSellerProducts(query: GetSellerProductsRequestDto, user: JwtVerifiedPayload) {
    return this.productListService.getSellerProducts(query, user);
  }

  /**
   * 판매자용 상품 상세 조회
   * 자신이 소유한 스토어의 상품만 조회 가능합니다.
   */
  async getSellerProductDetail(id: string, user: JwtVerifiedPayload) {
    return this.productDetailService.getSellerProductDetail(id, user);
  }

  /**
   * 상품 등록 (판매자용)
   */
  async createProduct(createProductDto: CreateProductRequestDto, user: JwtVerifiedPayload) {
    return this.productCreateService.createProduct(createProductDto, user);
  }

  /**
   * 상품 수정 (판매자용)
   */
  async updateProduct(
    id: string,
    updateProductDto: UpdateProductRequestDto,
    user: JwtVerifiedPayload,
  ) {
    return this.productUpdateService.updateProduct(id, updateProductDto, user);
  }

  /**
   * 상품 삭제 (판매자용)
   */
  async deleteProduct(id: string, user: JwtVerifiedPayload) {
    await this.productDeleteService.deleteProduct(id, user);
  }
}
