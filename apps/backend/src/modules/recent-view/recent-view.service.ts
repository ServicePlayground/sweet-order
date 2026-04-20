import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { EnableStatus } from "@apps/backend/modules/product/constants/product.constants";
import {
  ProductMapperUtil,
  ProductWithReviewsAndStore,
} from "@apps/backend/modules/product/utils/product-mapper.util";
import { ProductListResponseDto } from "@apps/backend/modules/product/dto/product-list.dto";
import { ProductResponseDto } from "@apps/backend/modules/product/dto/product-detail.dto";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";
import { GetRecentViewedProductsRequestDto } from "@apps/backend/modules/recent-view/dto/recent-view-list.dto";

/**
 * 최근 본 상품 서비스
 * 조회 이력 저장 및 마이페이지 최근 본 상품 목록 조회를 담당합니다.
 */
@Injectable()
export class RecentViewService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 상품 상세 조회 시 최근 본 이력 저장 (로그인 사용자)
   * 동일 상품 재조회 시 viewedAt만 갱신됩니다.
   */
  async recordProductView(userId: string, productId: string): Promise<void> {
    await this.prisma.productRecentView.upsert({
      where: {
        consumerId_productId: { consumerId: userId, productId },
      },
      create: { consumerId: userId, productId },
      update: { viewedAt: new Date() },
    });
  }

  /**
   * 마이페이지 - 최근 본 상품 목록 조회
   * 노출 중인 상품만 포함하며, 조회 시점 기준 최신순으로 반환합니다.
   */
  async getRecentViewedProductsForUser(
    userId: string,
    query: GetRecentViewedProductsRequestDto,
  ): Promise<ProductListResponseDto> {
    const { page, limit } = query;
    const where = {
      consumerId: userId,
      product: { visibilityStatus: EnableStatus.ENABLE },
    };

    const totalItems = await this.prisma.productRecentView.count({ where });
    const skip = (page - 1) * limit;

    const views = await this.prisma.productRecentView.findMany({
      where,
      // 최근 본 시각 우선, 동률 시 안정적인 페이지네이션을 위한 보조 정렬
      orderBy: [{ viewedAt: "desc" }, { productId: "desc" }],
      skip,
      take: limit,
      include: {
        product: {
          include: {
            reviews: ProductMapperUtil.REVIEWS_INCLUDE_FOR_STATS,
            store: { select: ProductMapperUtil.STORE_INFO_SELECT },
          },
        },
      },
    });

    const products = views.map((v: { product: ProductWithReviewsAndStore }) => v.product);
    const productIds = products.map((p: ProductWithReviewsAndStore) => p.id);
    const likedIds = await this.getLikedProductIds(userId, productIds);

    const data: ProductResponseDto[] = products.map((product: ProductWithReviewsAndStore) =>
      ProductMapperUtil.mapToProductResponse(product, likedIds.has(product.id)),
    );

    const meta = calculatePaginationMeta(page, limit, totalItems);
    return { data, meta };
  }

  private async getLikedProductIds(userId: string, productIds: string[]): Promise<Set<string>> {
    if (productIds.length === 0) return new Set<string>();
    const likes = await this.prisma.productLike.findMany({
      where: { consumerId: userId, productId: { in: productIds } },
      select: { productId: true },
    });
    return new Set(likes.map((l) => l.productId));
  }
}
