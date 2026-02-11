import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  EnableStatus,
  PRODUCT_ERROR_MESSAGES,
} from "@apps/backend/modules/product/constants/product.constants";
import { ProductMapperUtil } from "@apps/backend/modules/product/utils/product-mapper.util";
import { LikeProductDetailService } from "@apps/backend/modules/like/services/like-product-detail.service";

@Injectable()
export class ProductDetailService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly likeProductDetailService: LikeProductDetailService,
  ) {}

  /**
   * 상품 상세 조회
   * @param id - 상품 ID
   * @param user - 로그인한 사용자 정보 (옵셔널)
   */
  async getProductDetail(id: string, user?: JwtVerifiedPayload) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        visibilityStatus: EnableStatus.ENABLE,
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

    if (!product) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    let isLiked: boolean | null = null;
    if (user?.sub) {
      try {
        isLiked = await this.likeProductDetailService.isProductLiked(user.sub, id);
      } catch {
        isLiked = null;
      }
    }

    return ProductMapperUtil.mapToProductResponse(product, isLiked);
  }

  /**
   * 판매자용 상품 상세 조회
   * 자신이 소유한 스토어의 상품만 조회 가능합니다.
   */
  async getSellerProductDetail(id: string, user: JwtVerifiedPayload) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
      },
      include: {
        reviews: {
          select: ProductMapperUtil.REVIEWS_RATING_SELECT_ONLY,
        },
        store: {
          select: ProductMapperUtil.STORE_INFO_WITH_USER_ID_SELECT,
        },
      },
    });

    if (!product || !product.store) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    if (product.store.userId !== user.sub) {
      throw new UnauthorizedException(PRODUCT_ERROR_MESSAGES.FORBIDDEN);
    }

    let isLiked: boolean | null = null;
    try {
      isLiked = await this.likeProductDetailService.isProductLiked(user.sub, id);
    } catch {
      isLiked = null;
    }

    return ProductMapperUtil.mapToProductResponse(product, isLiked);
  }
}
