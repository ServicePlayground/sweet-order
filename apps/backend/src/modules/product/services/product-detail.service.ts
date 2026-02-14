import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  EnableStatus,
  PRODUCT_ERROR_MESSAGES,
} from "@apps/backend/modules/product/constants/product.constants";
import { ProductMapperUtil } from "@apps/backend/modules/product/utils/product-mapper.util";
import { LikeProductDetailService } from "@apps/backend/modules/like/services/like-product-detail.service";
import { ProductOwnershipUtil } from "@apps/backend/modules/product/utils/product-ownership.util";

@Injectable()
export class ProductDetailService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly likeProductDetailService: LikeProductDetailService,
  ) {}

  /**
   * 상품 상세 조회 (사용자용)
   * @param id - 상품 ID
   * @param user - 로그인한 사용자 정보 (옵셔널)
   */
  async getProductDetailForUser(id: string, user?: JwtVerifiedPayload) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        reviews: {
          select: ProductMapperUtil.REVIEWS_RATING_SELECT_ONLY,
        },
        store: {
          select: ProductMapperUtil.STORE_INFO_SELECT,
        },
      },
    });

    if (!product || product.visibilityStatus !== EnableStatus.ENABLE) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    let isLiked: boolean | null = null;
    if (user?.sub) {
      try {
        isLiked = await this.likeProductDetailService.isProductLiked(user.sub, id);
      } catch (error: unknown) {
        if (!(error instanceof NotFoundException)) {
          throw error;
        }
        isLiked = null;
      }
    }

    return ProductMapperUtil.mapToProductResponse(product, isLiked);
  }

  /**
   * 판매자용 상품 상세 조회 (판매자용)
   * 자신이 소유한 스토어의 상품만 조회 가능합니다.
   */
  async getProductDetailForSeller(id: string, user: JwtVerifiedPayload) {
    // 상품 소유권 확인
    await ProductOwnershipUtil.verifyProductOwnership(
      this.prisma,
      id,
      user.sub,
      ProductMapperUtil.STORE_INFO_WITH_USER_ID_SELECT,
    );

    // 후기 정보 포함하여 조회
    const productWithReviews = await this.prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          select: ProductMapperUtil.REVIEWS_RATING_SELECT_ONLY,
        },
        store: {
          select: ProductMapperUtil.STORE_INFO_WITH_USER_ID_SELECT,
        },
      },
    });

    if (!productWithReviews) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    let isLiked: boolean | null = null;
    try {
      isLiked = await this.likeProductDetailService.isProductLiked(user.sub, id);
    } catch (error: unknown) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
      isLiked = null;
    }

    return ProductMapperUtil.mapToProductResponse(productWithReviews, isLiked);
  }
}
