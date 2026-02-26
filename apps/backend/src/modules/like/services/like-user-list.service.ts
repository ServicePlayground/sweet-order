import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  GetStoresRequestDto,
  StoreListResponseDto,
} from "@apps/backend/modules/store/dto/store-list.dto";
import {
  GetProductsRequestDto,
  ProductListResponseDto,
} from "@apps/backend/modules/product/dto/product-list.dto";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";
import { ProductMapperUtil } from "@apps/backend/modules/product/utils/product-mapper.util";
import { StoreMapperUtil } from "@apps/backend/modules/store/utils/store-mapper.util";
import { ProductResponseDto } from "@apps/backend/modules/product/dto/product-detail.dto";
import { StoreResponseDto } from "@apps/backend/modules/store/dto/store-detail.dto";
import { StoreSortBy } from "@apps/backend/modules/store/constants/store.constants";
import {
  parseRegionsParam,
  buildStoreWhereInputForRegions,
} from "@apps/backend/modules/store/utils/region-filter.util";
import {
  SortBy,
  EnableStatus,
  ProductType,
  ProductCategoryType,
} from "@apps/backend/modules/product/constants/product.constants";

/**
 * 내가 좋아요한 목록 조회 서비스
 * 사용자가 좋아요한 상품 및 스토어 목록 관련 비즈니스 로직을 처리합니다.
 * 스토어/상품 목록 조회와 동일한 정렬·필터를 지원합니다.
 */
@Injectable()
export class LikeUserListService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 내가 좋아요한 스토어 목록 조회 (사용자용)
   * 정렬(sortBy), 검색(스토어명), 지역 필터, 페이지네이션을 지원합니다.
   */
  async getMyStoreLikesForUser(
    userId: string,
    query: GetStoresRequestDto,
  ): Promise<StoreListResponseDto> {
    const { page, limit, sortBy, search, regions } = query;

    const storeWhere = this.buildStoreWhereForLiked(search, regions);
    const orderBy = this.buildStoreOrderByForRelation(sortBy ?? StoreSortBy.LATEST);

    const where: Prisma.StoreLikeWhereInput = {
      userId,
      ...(Object.keys(storeWhere).length > 0 ? { store: storeWhere } : {}),
    };

    const totalItems = await this.prisma.storeLike.count({ where });

    const skip = (page - 1) * limit;

    const storeLikes = await this.prisma.storeLike.findMany({
      where,
      orderBy: { store: orderBy as Prisma.StoreOrderByWithRelationInput },
      skip,
      take: limit,
      include: {
        store: true,
      },
    });

    const stores = storeLikes.map((storeLike) => storeLike.store);
    const data = (await StoreMapperUtil.mapToStoreResponse(
      stores,
      this.prisma,
    )) as StoreResponseDto[];

    // 마이페이지 좋아요 목록이므로 모두 좋아요한 스토어
    for (const res of data) {
      res.isLiked = true;
    }

    const meta = calculatePaginationMeta(page, limit, totalItems);

    return { data, meta };
  }

  /**
   * 내가 좋아요한 상품 목록 조회 (사용자용)
   * 정렬(sortBy), 검색, 가격/스토어/타입/카테고리/지역 필터, 페이지네이션을 지원합니다.
   * REVIEW_COUNT, RATING_AVG 정렬은 인기순(좋아요 수)으로 대체합니다.
   */
  async getMyProductLikesForUser(
    userId: string,
    query: GetProductsRequestDto,
  ): Promise<ProductListResponseDto> {
    const {
      page,
      limit,
      sortBy,
      search,
      minPrice,
      maxPrice,
      storeId,
      productType,
      productCategoryTypes,
      regions,
    } = query;

    let storeIdsFromRegion: string[] | undefined;
    const parsedRegions = parseRegionsParam(regions);
    if (parsedRegions) {
      const regionWhere = buildStoreWhereInputForRegions(parsedRegions);
      if (!regionWhere) {
        storeIdsFromRegion = [];
      } else {
        const stores = await this.prisma.store.findMany({
          where: regionWhere,
          select: { id: true },
        });
        const ids = stores.map((s) => s.id);
        storeIdsFromRegion = storeId ? (ids.includes(storeId) ? [storeId] : []) : ids;
      }
    }

    const productWhere = this.buildProductWhereForLiked(
      search,
      minPrice,
      maxPrice,
      storeId,
      storeIdsFromRegion,
      productType,
      productCategoryTypes,
    );

    const effectiveSortBy =
      sortBy === SortBy.REVIEW_COUNT || sortBy === SortBy.RATING_AVG ? SortBy.POPULAR : sortBy;
    const orderBy = this.buildProductOrderByForRelation(effectiveSortBy);

    const where: Prisma.ProductLikeWhereInput = {
      userId,
      product: productWhere,
    };

    const totalItems = await this.prisma.productLike.count({ where });

    const skip = (page - 1) * limit;

    const productLikes = await this.prisma.productLike.findMany({
      where,
      orderBy: { product: orderBy as Prisma.ProductOrderByWithRelationInput },
      skip,
      take: limit,
      include: {
        product: {
          include: {
            store: {
              select: {
                name: true,
                logoImageUrl: true,
                address: true,
                roadAddress: true,
                detailAddress: true,
                zonecode: true,
                latitude: true,
                longitude: true,
              },
            },
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });

    const data: ProductResponseDto[] = productLikes.map((productLike) => {
      return ProductMapperUtil.mapToProductResponse(productLike.product, true);
    });

    const meta = calculatePaginationMeta(page, limit, totalItems);

    return { data, meta };
  }

  /**
   * 스토어 좋아요 목록용 스토어 where (검색, 지역)
   */
  private buildStoreWhereForLiked(search?: string, regions?: string): Prisma.StoreWhereInput {
    const conditions: Prisma.StoreWhereInput[] = [];

    if (search?.trim()) {
      const keyword = search.trim();
      conditions.push({ name: { contains: keyword, mode: "insensitive" } });
    }

    const parsedRegions = parseRegionsParam(regions);
    const regionWhere = buildStoreWhereInputForRegions(parsedRegions);
    if (regionWhere) {
      conditions.push(regionWhere);
    }

    if (conditions.length === 0) return {};
    if (conditions.length === 1) return conditions[0];
    return { AND: conditions };
  }

  /**
   * 스토어 좋아요 목록 정렬 (store relation 기준)
   */
  private buildStoreOrderByForRelation(sortBy: StoreSortBy): Prisma.StoreOrderByWithRelationInput {
    switch (sortBy) {
      case StoreSortBy.POPULAR:
        return { likeCount: "desc" };
      case StoreSortBy.LATEST:
      default:
        return { createdAt: "desc" };
    }
  }

  /**
   * 상품 좋아요 목록용 상품 where (노출상태, 검색, 가격, 스토어, 타입, 카테고리)
   */
  private buildProductWhereForLiked(
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    storeId?: string,
    storeIdsFromRegion?: string[],
    productType?: ProductType,
    productCategoryTypes?: ProductCategoryType[],
  ): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput & { AND?: Prisma.ProductWhereInput[] } = {
      visibilityStatus: EnableStatus.ENABLE,
    };

    if (storeIdsFromRegion !== undefined) {
      where.storeId = { in: storeIdsFromRegion };
    } else if (storeId) {
      where.storeId = storeId;
    }

    this.addProductCommonFilters(
      where,
      search,
      minPrice,
      maxPrice,
      productType,
      productCategoryTypes,
    );

    return where;
  }

  /**
   * 상품 공통 필터 (검색, 가격, 타입, 카테고리) - product-list와 동일
   */
  private addProductCommonFilters(
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
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { searchTags: { has: search } },
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
   * 상품 좋아요 목록 정렬 (product relation 기준)
   */
  private buildProductOrderByForRelation(sortBy: SortBy): Prisma.ProductOrderByWithRelationInput {
    switch (sortBy) {
      case SortBy.LATEST:
        return { createdAt: "desc" };
      case SortBy.PRICE_ASC:
        return { salePrice: "asc" };
      case SortBy.PRICE_DESC:
        return { salePrice: "desc" };
      case SortBy.POPULAR:
      case SortBy.REVIEW_COUNT:
      case SortBy.RATING_AVG:
      default:
        return { likeCount: "desc" };
    }
  }
}
