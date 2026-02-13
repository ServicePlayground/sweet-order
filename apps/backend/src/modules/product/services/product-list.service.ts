import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  GetProductsRequestDto,
  GetSellerProductsRequestDto,
} from "@apps/backend/modules/product/dto/product-request.dto";
import {
  EnableStatus,
  ProductType,
  ProductCategoryType,
  SortBy,
  PRODUCT_ERROR_MESSAGES,
} from "@apps/backend/modules/product/constants/product.constants";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import {
  ProductMapperUtil,
  ProductWithReviewsAndStore,
} from "@apps/backend/modules/product/utils/product-mapper.util";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { LikeProductDetailService } from "@apps/backend/modules/like/services/like-product-detail.service";

@Injectable()
export class ProductListService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly likeProductDetailService: LikeProductDetailService,
  ) {}

  /**
   * 여러 상품에 대한 좋아요 여부를 한 번에 조회 (N+1 문제 방지)
   * @param userId - 사용자 ID
   * @param productIds - 상품 ID 목록
   * @returns 좋아요한 상품 ID Set
   */
  private async getLikedProductIds(userId: string, productIds: string[]): Promise<Set<string>> {
    if (productIds.length === 0) {
      return new Set<string>();
    }

    const likes = await this.prisma.productLike.findMany({
      where: {
        userId,
        productId: {
          in: productIds,
        },
      },
      select: {
        productId: true,
      },
    });

    return new Set(likes.map((like) => like.productId));
  }

  /**
   * 후기 통계 계산 (후기 수와 평균 별점)
   */
  private calculateReviewStats<T extends { reviews: Array<{ rating: number }> }>(
    products: T[],
  ): (T & { reviewCount: number; avgRating: number })[] {
    return products.map((product) => {
      const reviewCount = product.reviews.length;
      const avgRating =
        reviewCount > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
          : 0;

      return {
        ...product,
        reviewCount,
        avgRating,
      };
    });
  }

  /**
   * 후기 통계 기반 정렬 (후기 수 또는 평균 별점)
   */
  private sortProductsByReviewStats<
    T extends { reviewCount: number; avgRating: number; createdAt: Date },
  >(products: T[], sortBy: SortBy): void {
    if (sortBy === SortBy.REVIEW_COUNT) {
      products.sort((a, b) => {
        if (b.reviewCount !== a.reviewCount) {
          return b.reviewCount - a.reviewCount;
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    } else if (sortBy === SortBy.RATING_AVG) {
      products.sort((a, b) => {
        if (b.avgRating !== a.avgRating) {
          return b.avgRating - a.avgRating;
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    }
  }

  /**
   * 공통 필터 조건 추가 (검색어, 가격, 상품 타입, 상품 카테고리 타입)
   */
  private addCommonFilters(
    where: Prisma.ProductWhereInput & { AND?: Prisma.ProductWhereInput[] },
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    productType?: ProductType,
    productCategoryTypes?: ProductCategoryType[],
  ): void {
    const searchConditions: Prisma.ProductWhereInput[] = [];
    if (search) {
      searchConditions.push(
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } }, // 상품명에서 검색 (대소문자 구분 없음)
        { searchTags: { has: search } }, // 검색 태그에서 검색 (정확히 일치)
      );
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.salePrice = {};
      if (minPrice !== undefined) where.salePrice.gte = minPrice;
      if (maxPrice !== undefined) where.salePrice.lte = maxPrice;
    }

    if (productType) {
      where.productType = productType;
    }

    if (productCategoryTypes?.length) {
      where.productCategoryTypes = { hasSome: productCategoryTypes };
    }

    if (searchConditions.length > 0) {
      where.AND = where.AND || [];
      where.AND.push({ OR: searchConditions });
    }
  }

  /**
   * 상품 목록 조회 (필터링, 정렬, 무한스크롤 지원)
   */
  async getProducts(query: GetProductsRequestDto, user?: JwtVerifiedPayload) {
    const {
      search,
      page,
      limit,
      sortBy,
      minPrice,
      maxPrice,
      storeId,
      productType,
      productCategoryTypes,
    } = query;

    const where: Prisma.ProductWhereInput & { AND?: Prisma.ProductWhereInput[] } = {
      visibilityStatus: EnableStatus.ENABLE,
    };

    if (storeId) {
      where.storeId = storeId;
    }

    this.addCommonFilters(where, search, minPrice, maxPrice, productType, productCategoryTypes);

    const totalItems = await this.prisma.product.count({ where });

    const needsReviewData = sortBy === SortBy.REVIEW_COUNT || sortBy === SortBy.RATING_AVG;

    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];
    let products;

    if (needsReviewData) {
      const allProducts: ProductWithReviewsAndStore[] = await this.prisma.product.findMany({
        where,
        include: {
          reviews: {
            select: ProductMapperUtil.REVIEWS_RATING_SELECT_ONLY,
          },
          store: {
            select: ProductMapperUtil.STORE_INFO_SELECT,
          },
        },
      });

      const productsWithStats = this.calculateReviewStats(allProducts);
      this.sortProductsByReviewStats(productsWithStats, sortBy);

      const skip = (page - 1) * limit;
      const paginatedProducts = productsWithStats.slice(skip, skip + limit);

      const productIds = paginatedProducts.map((p) => p.id);
      const likedProductIds = user?.sub
        ? await this.getLikedProductIds(user.sub, productIds)
        : new Set<string>();

      products = paginatedProducts.map((product) =>
        ProductMapperUtil.mapToProductResponse(
          product,
          user?.sub ? likedProductIds.has(product.id) : null,
        ),
      );
    } else {
      switch (sortBy) {
        case SortBy.LATEST:
          orderBy = [{ createdAt: "desc" }];
          break;
        case SortBy.PRICE_ASC:
          orderBy = [{ salePrice: "asc" }, { createdAt: "desc" }];
          break;
        case SortBy.PRICE_DESC:
          orderBy = [{ salePrice: "desc" }, { createdAt: "desc" }];
          break;
        case SortBy.POPULAR:
        default:
          orderBy = [{ likeCount: "desc" }, { createdAt: "desc" }];
          break;
      }

      const skip = (page - 1) * limit;

      const productsWithStore = await this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          reviews: {
            select: ProductMapperUtil.REVIEWS_RATING_SELECT_ONLY,
          },
          store: {
            select: ProductMapperUtil.STORE_INFO_SELECT,
          },
        },
      });

      const productIds = productsWithStore.map((p) => p.id);
      const likedProductIds = user?.sub
        ? await this.getLikedProductIds(user.sub, productIds)
        : new Set<string>();

      products = productsWithStore.map((product) =>
        ProductMapperUtil.mapToProductResponse(
          product,
          user?.sub ? likedProductIds.has(product.id) : null,
        ),
      );
    }

    const data = products;
    const meta = calculatePaginationMeta(page, limit, totalItems);

    return { data, meta };
  }

  /**
   * 판매자용 상품 목록 조회 (필터링, 정렬, 무한스크롤 지원)
   * 자신이 소유한 스토어의 상품만 조회합니다.
   */
  async getSellerProducts(query: GetSellerProductsRequestDto, user: JwtVerifiedPayload) {
    const {
      search,
      page,
      limit,
      sortBy,
      minPrice,
      maxPrice,
      storeId,
      salesStatus,
      visibilityStatus,
      productType,
      productCategoryTypes,
    } = query;

    const userStores = await this.prisma.store.findMany({
      where: {
        userId: user.sub,
      },
      select: {
        id: true,
      },
    });

    const userStoreIds = userStores.map((store) => store.id);

    if (userStoreIds.length === 0) {
      return {
        data: [],
        meta: calculatePaginationMeta(page, limit, 0),
      };
    }

    const where: Prisma.ProductWhereInput & { AND?: Prisma.ProductWhereInput[] } = {
      storeId: {
        in: userStoreIds,
      },
    };

    if (storeId) {
      if (!userStoreIds.includes(storeId)) {
        throw new UnauthorizedException(PRODUCT_ERROR_MESSAGES.STORE_NOT_OWNED);
      }
      where.storeId = storeId;
    }

    if (salesStatus !== undefined) {
      where.salesStatus = salesStatus;
    }

    if (visibilityStatus !== undefined) {
      where.visibilityStatus = visibilityStatus;
    }

    this.addCommonFilters(where, search, minPrice, maxPrice, productType, productCategoryTypes);

    const totalItems = await this.prisma.product.count({ where });

    const needsReviewData = sortBy === SortBy.REVIEW_COUNT || sortBy === SortBy.RATING_AVG;

    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];
    let products;

    if (needsReviewData) {
      const allProducts: ProductWithReviewsAndStore[] = await this.prisma.product.findMany({
        where,
        include: {
          reviews: {
            select: ProductMapperUtil.REVIEWS_RATING_SELECT_ONLY,
          },
          store: {
            select: ProductMapperUtil.STORE_INFO_SELECT,
          },
        },
      });

      const productsWithStats = this.calculateReviewStats(allProducts);
      this.sortProductsByReviewStats(productsWithStats, sortBy);

      const skip = (page - 1) * limit;
      const paginatedProducts = productsWithStats.slice(skip, skip + limit);

      const productIds = paginatedProducts.map((p) => p.id);
      const likedProductIds = await this.getLikedProductIds(user.sub, productIds);

      products = paginatedProducts.map((product) =>
        ProductMapperUtil.mapToProductResponse(product, likedProductIds.has(product.id)),
      );
    } else {
      switch (sortBy) {
        case SortBy.LATEST:
          orderBy = [{ createdAt: "desc" }];
          break;
        case SortBy.PRICE_ASC:
          orderBy = [{ salePrice: "asc" }, { createdAt: "desc" }];
          break;
        case SortBy.PRICE_DESC:
          orderBy = [{ salePrice: "desc" }, { createdAt: "desc" }];
          break;
        case SortBy.POPULAR:
        default:
          orderBy = [{ likeCount: "desc" }, { createdAt: "desc" }];
          break;
      }

      const skip = (page - 1) * limit;

      const productsWithStore = await this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          reviews: {
            select: ProductMapperUtil.REVIEWS_RATING_SELECT_ONLY,
          },
          store: {
            select: ProductMapperUtil.STORE_INFO_SELECT,
          },
        },
      });

      const productIds = productsWithStore.map((p) => p.id);
      const likedProductIds = await this.getLikedProductIds(user.sub, productIds);

      products = productsWithStore.map((product) =>
        ProductMapperUtil.mapToProductResponse(product, likedProductIds.has(product.id)),
      );
    }

    const data = products;
    const meta = calculatePaginationMeta(page, limit, totalItems);

    return { data, meta };
  }
}
