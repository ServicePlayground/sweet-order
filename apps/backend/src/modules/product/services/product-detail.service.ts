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
   * 판매자용 상품 상세 조회 (판매자용)
   * 자신이 소유한 스토어의 상품만 조회 가능합니다.
   */
  async getProductDetailForSeller(id: string, user: JwtVerifiedPayload) {
    // 소유권 확인 (이미 상품이 존재함을 보장)
    await ProductOwnershipUtil.verifyProductOwnership(
      this.prisma,
      id,
      user.sub,
      ProductMapperUtil.STORE_INFO_WITH_USER_ID_SELECT,
    );

    // 리뷰 정보 포함하여 조회
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

    // verifyProductOwnership이 이미 상품 존재를 보장하므로 null 체크 불필요하지만, 타입 안정성을 위해 유지
    if (!product) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
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
