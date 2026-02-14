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
   * 상품 목록 조회 (사용자용)
   * 필터링, 정렬, 무한스크롤을 지원합니다.
   * @param query - 조회 조건
   * @param user - 로그인한 사용자 정보 (옵셔널)
   */
  async getProductsForUser(query: GetProductsRequestDto, user?: JwtVerifiedPayload) {
    return this.productListService.getProductsForUser(query, user);
  }

  /**
   * 상품 상세 조회 (사용자용)
   * @param id - 상품 ID
   * @param user - 로그인한 사용자 정보 (옵셔널)
   */
  async getProductDetailForUser(id: string, user?: JwtVerifiedPayload) {
    return this.productDetailService.getProductDetailForUser(id, user);
  }

  /**
   * 판매자용 상품 목록 조회 (판매자용)
   * 자신이 소유한 스토어의 상품만 조회합니다.
   */
  async getProductsForSeller(query: GetSellerProductsRequestDto, user: JwtVerifiedPayload) {
    return this.productListService.getProductsForSeller(query, user);
  }

  /**
   * 판매자용 상품 상세 조회 (판매자용)
   * 자신이 소유한 스토어의 상품만 조회 가능합니다.
   */
  async getProductDetailForSeller(id: string, user: JwtVerifiedPayload) {
    return this.productDetailService.getProductDetailForSeller(id, user);
  }

  /**
   * 상품 등록 (판매자용)
   */
  async createProductForSeller(
    createProductDto: CreateProductRequestDto,
    user: JwtVerifiedPayload,
  ) {
    return this.productCreateService.createProductForSeller(createProductDto, user);
  }

  /**
   * 상품 수정 (판매자용)
   */
  async updateProductForSeller(
    id: string,
    updateProductDto: UpdateProductRequestDto,
    user: JwtVerifiedPayload,
  ) {
    return this.productUpdateService.updateProductForSeller(id, updateProductDto, user);
  }

  /**
   * 상품 삭제 (판매자용)
   */
  async deleteProductForSeller(id: string, user: JwtVerifiedPayload) {
    await this.productDeleteService.deleteProductForSeller(id, user);
  }
}
