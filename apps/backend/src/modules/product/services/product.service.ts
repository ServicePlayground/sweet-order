import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  GetProductsRequestDto,
  GetSellerProductsRequestDto,
  CreateProductRequestDto,
  UpdateProductRequestDto,
} from "@apps/backend/modules/product/dto/product-request.dto";
import {
  SortBy,
  EnableStatus,
  ProductType,
  PRODUCT_ERROR_MESSAGES,
} from "@apps/backend/modules/product/constants/product.constants";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import {
  ProductMapperUtil,
  ProductWithReviewsAndStore,
} from "@apps/backend/modules/product/utils/product-mapper.util";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";

/**
 * 상품 서비스
 * 사용자용 상품 조회, 검색, 필터링 등의 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 케이크 옵션용 랜덤 ID 생성
   * - 생성 시 한 번만 부여되고 이후에는 변경되지 않도록 사용
   */
  private generateOptionId(prefix: "size" | "flavor"): string {
    const random = Math.random().toString(36).substring(2, 10);
    return `${prefix}_${random}`;
  }

  /**
   * 후기 통계 계산 (후기 수와 평균 별점)
   */
  private calculateReviewStats<T extends { reviews: Array<{ rating: number }> }>(
    products: T[],
  ): (T & { reviewCount: number; avgRating: number })[] {
    return products.map((product) => {
      const reviewCount =product.reviews.length;
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
  private sortProductsByReviewStats<T extends { reviewCount: number; avgRating: number; createdAt: Date }>(
    products: T[],
    sortBy: SortBy,
  ): void {
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
   * 케이크 옵션에 ID 부여 (기존 ID 유지, 새 옵션에는 새 ID 생성)
   */
  private processCakeOptionsWithIds(
    existingOptions: any[],
    newOptions: Array<{ id?: string }>,
    prefix: "size" | "flavor",
  ): Array<{ id: string }> {
    const existingOptionsById = new Map<string, any>();

    for (const option of existingOptions) {
      if (
        option &&
        typeof option === "object" &&
        "id" in option &&
        typeof option.id === "string"
      ) {
        existingOptionsById.set(option.id, option);
      }
    }

    return newOptions.map((option) => {
      const existing =
        option.id && existingOptionsById.has(option.id)
          ? existingOptionsById.get(option.id)
          : undefined;

      const id = existing?.id ?? option.id ?? this.generateOptionId(prefix);

      // ID는 한 번 정해지면 그대로 유지하고, 나머지 필드는 요청 값으로 덮어씀
      return {
        ...existing,
        ...option,
        id,
      };
    });
  }

  /**
   * 공통 필터 조건 추가 (검색어, 가격, 상품 타입)
   */
  private addCommonFilters(
    where: Prisma.ProductWhereInput & { AND?: Prisma.ProductWhereInput[] },
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    productType?: ProductType,
  ): void {
    // 검색어 조건 (상품명에서만 검색)
    const searchConditions: Prisma.ProductWhereInput[] = [];
    if (search) {
      searchConditions.push(
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } }, // 상품명에서 검색 (대소문자 구분 없음)
      );
    }

    // 가격 필터 처리
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.salePrice = {};
      if (minPrice !== undefined) where.salePrice.gte = minPrice;
      if (maxPrice !== undefined) where.salePrice.lte = maxPrice;
    }

    // 상품 타입 필터 처리
    if (productType) {
      where.productType = productType;
    }

    // 검색어 조건을 최종 where에 추가
    if (searchConditions.length > 0) {
      // 검색어 조건을 OR로 묶어서 AND 조건에 추가
      where.AND = where.AND || [];
      where.AND.push({ OR: searchConditions });
    }
  }

  /**
   * 상품 목록 조회 (필터링, 정렬, 무한스크롤 지원)
   */
  async getProducts(query: GetProductsRequestDto) {
    const { search, page, limit, sortBy, minPrice, maxPrice, storeId, productType } = query;

    // 필터 조건 구성
    const where: Prisma.ProductWhereInput & { AND?: Prisma.ProductWhereInput[] } = {
      visibilityStatus: EnableStatus.ENABLE, // 노출된 상품만 조회
      // status: ProductStatus.ACTIVE, // 판매중인 상품만 조회 // 프론트엔드에서 처리
    };

    // 스토어 ID 필터 처리
    if (storeId) {
      where.storeId = storeId;
    }

    // 공통 필터 조건 추가 (검색어, 가격, 상품 타입)
    this.addCommonFilters(where, search, minPrice, maxPrice, productType);

    // 전체 개수 조회
    const totalItems = await this.prisma.product.count({ where });

    // 후기 수나 평균 별점으로 정렬하는 경우, reviews를 포함하여 조회
    const needsReviewData = sortBy === SortBy.REVIEW_COUNT || sortBy === SortBy.RATING_AVG;

    // 정렬 조건 구성
    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];
    let products;

    if (needsReviewData) {
      // 후기 수나 평균 별점으로 정렬하는 경우
      // 모든 필터링된 상품을 조회 (reviews 및 store 포함)
      const allProducts: ProductWithReviewsAndStore[] = await this.prisma.product.findMany({
        where,
        include: {
          reviews: {
            select: ProductMapperUtil.REVIEWS_RATING_SELECT_ONLY,
          },
          store: {
            select: ProductMapperUtil.STORE_LOCATION_SELECT,
          },
        },
      });

      // 후기 수와 평균 별점 계산 및 정렬
      const productsWithStats = this.calculateReviewStats(allProducts);
      this.sortProductsByReviewStats(productsWithStats, sortBy);

      // reviews 필드 제거하고 픽업장소 정보 매핑 (원래 구조로 복원)
      products = productsWithStats.map((product) =>
        ProductMapperUtil.mapToProductResponse(product),
      );

      // 페이지네이션 적용
      const skip = (page - 1) * limit;
      products = products.slice(skip, skip + limit);
    } else {
      // 일반 정렬 (Prisma orderBy 사용)
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
        case SortBy.POPULAR: // 좋아요 수 내림차순
        default:
          orderBy = [{ likeCount: "desc" }, { createdAt: "desc" }];
          break;
      }

      // 무한스크롤 계산
      const skip = (page - 1) * limit;

      // 상품 목록 조회 (store 포함)
      const productsWithStore = await this.prisma.product.findMany({
        where, // 필터 조건 (검색어, 카테고리, 가격대 등)
        orderBy, // 정렬 조건 (최신순, 가격순, 인기순 등)
        skip, // 무한스크롤을 위한 건너뛸 항목 수
        take: limit, // 가져올 항목 수 (페이지당 상품 개수)
        include: {
          store: {
            select: ProductMapperUtil.STORE_LOCATION_SELECT,
          },
        },
      });

      // 픽업장소 정보 매핑
      products = productsWithStore.map((product) =>
        ProductMapperUtil.mapToProductResponse(product),
      );
    }

    // 응답 데이터 변환
    const data = products;

    // 무한스크롤 메타 정보
    const meta = calculatePaginationMeta(page, limit, totalItems);

    return { data, meta };
  }

  /**
   * 상품 상세 조회
   */
  async getProductDetail(id: string) {
    // 상품 상세 정보 조회 (노출된 상품만 조회, store 포함)
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        visibilityStatus: EnableStatus.ENABLE, // 노출된 상품만 조회
        // status: ProductStatus.ACTIVE, // 판매중인 상품만 조회 // 프론트엔드에서 처리
      },
      include: {
        store: {
          select: ProductMapperUtil.STORE_LOCATION_SELECT,
        },
      },
    });

    // 상품이 존재하지 않으면 404 에러
    if (!product) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    // 픽업장소 정보 매핑
    return ProductMapperUtil.mapToProductResponse(product);
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
    } = query;

    // 자신이 소유한 스토어 목록 조회
    const userStores = await this.prisma.store.findMany({
      where: {
        userId: user.sub,
      },
      select: {
        id: true,
      },
    });

    const userStoreIds = userStores.map((store) => store.id);

    // 자신의 스토어가 없으면 빈 결과 반환
    if (userStoreIds.length === 0) {
      return {
        data: [],
        meta: calculatePaginationMeta(page, limit, 0),
      };
    }

    // 필터 조건 구성
    const where: Prisma.ProductWhereInput & { AND?: Prisma.ProductWhereInput[] } = {
      storeId: {
        in: userStoreIds, // 자신이 소유한 스토어의 상품만 조회
      },
    };

    // 특정 스토어 필터 (자신의 스토어인지 확인)
    if (storeId) {
      if (!userStoreIds.includes(storeId)) {
        throw new UnauthorizedException(PRODUCT_ERROR_MESSAGES.STORE_NOT_OWNED);
      }
      where.storeId = storeId;
    }

    // 판매 상태 필터
    if (salesStatus !== undefined) {
      where.salesStatus = salesStatus;
    }

    // 노출 상태 필터
    if (visibilityStatus !== undefined) {
      where.visibilityStatus = visibilityStatus;
    }

    // 공통 필터 조건 추가 (검색어, 가격, 상품 타입)
    this.addCommonFilters(where, search, minPrice, maxPrice, productType);

    // 전체 개수 조회
    const totalItems = await this.prisma.product.count({ where });

    // 후기 수나 평균 별점으로 정렬하는 경우, reviews를 포함하여 조회
    const needsReviewData = sortBy === SortBy.REVIEW_COUNT || sortBy === SortBy.RATING_AVG;

    // 정렬 조건 구성
    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];
    let products;

    if (needsReviewData) {
      // 후기 수나 평균 별점으로 정렬하는 경우
      // 모든 필터링된 상품을 조회 (reviews 및 store 포함)
      const allProducts: ProductWithReviewsAndStore[] = await this.prisma.product.findMany({
        where,
        include: {
          reviews: {
            select: ProductMapperUtil.REVIEWS_RATING_SELECT_ONLY,
          },
          store: {
            select: ProductMapperUtil.STORE_LOCATION_SELECT,
          },
        },
      });

      // 후기 수와 평균 별점 계산 및 정렬
      const productsWithStats = this.calculateReviewStats(allProducts);
      this.sortProductsByReviewStats(productsWithStats, sortBy);

      // reviews 필드 제거하고 픽업장소 정보 매핑 (원래 구조로 복원)
      products = productsWithStats.map((product) =>
        ProductMapperUtil.mapToProductResponse(product),
      );

      // 페이지네이션 적용
      const skip = (page - 1) * limit;
      products = products.slice(skip, skip + limit);
    } else {
      // 일반 정렬 (Prisma orderBy 사용)
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
        case SortBy.POPULAR: // 좋아요 수 내림차순
        default:
          orderBy = [{ likeCount: "desc" }, { createdAt: "desc" }];
          break;
      }

      // 무한스크롤 계산
      const skip = (page - 1) * limit;

      // 상품 목록 조회 (store 포함)
      const productsWithStore = await this.prisma.product.findMany({
        where, // 필터 조건 (검색어, 카테고리, 가격대 등)
        orderBy, // 정렬 조건 (최신순, 가격순, 인기순 등)
        skip, // 무한스크롤을 위한 건너뛸 항목 수
        take: limit, // 가져올 항목 수 (페이지당 상품 개수)
        include: {
          store: {
            select: ProductMapperUtil.STORE_LOCATION_SELECT,
          },
        },
      });

      // 픽업장소 정보 매핑
      products = productsWithStore.map((product) =>
        ProductMapperUtil.mapToProductResponse(product),
      );
    }

    // 응답 데이터 변환
    const data = products;

    // 무한스크롤 메타 정보
    const meta = calculatePaginationMeta(page, limit, totalItems);

    return { data, meta };
  }

  /**
   * 판매자용 상품 상세 조회
   * 자신이 소유한 스토어의 상품만 조회 가능합니다.
   */
  async getSellerProductDetail(id: string, user: JwtVerifiedPayload) {
    // 상품 존재 여부 및 소유권 확인 (Store 정보 포함)
    const product = await this.prisma.product.findFirst({
      where: {
        id,
      },
      include: {
        store: {
          select: ProductMapperUtil.STORE_LOCATION_WITH_USER_ID_SELECT,
        },
      },
    });

    // 상품이 존재하지 않으면 404 에러
    if (!product || !product.store) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    // 권한 확인: 상품의 Store 소유자인지 확인
    if (product.store.userId !== user.sub) {
      throw new UnauthorizedException(PRODUCT_ERROR_MESSAGES.FORBIDDEN);
    }

    // 픽업장소 정보 매핑
    return ProductMapperUtil.mapToProductResponse(product);
  }

  /**
   * 상품 등록 (판매자용)
   */
  async createProduct(createProductDto: CreateProductRequestDto, user: JwtVerifiedPayload) {
    // 스토어 존재 여부 및 소유권 확인
    const store = await this.prisma.store.findFirst({
      where: {
        id: createProductDto.storeId,
      },
    });

    // 스토어가 존재하지 않으면 404 에러
    if (!store) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.STORE_NOT_FOUND);
    }

    // 권한 확인: 스토어 소유자인지 확인
    if (store.userId !== user.sub) {
      throw new UnauthorizedException(PRODUCT_ERROR_MESSAGES.STORE_NOT_OWNED);
    }

    // productNumber 생성 및 상품 생성 - 트랜잭션으로 동시성 문제 방지
    // 날짜-순번 형식 (예: 20240101-001)
    return await this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD

      // 같은 날 등록된 상품 수 조회 (트랜잭션 내에서 조회하여 동시성 보장)
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      const todayProductCount = await tx.product.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      // 순번 생성 (001, 002, ...)
      const sequence = String(todayProductCount + 1).padStart(3, "0");
      const productNumber = `${dateStr}-${sequence}`;

      // productType 자동 계산: imageUploadEnabled가 ENABLE이면 CUSTOM_CAKE, 아니면 BASIC_CAKE
      const productType =
        createProductDto.imageUploadEnabled === EnableStatus.ENABLE
          ? ProductType.CUSTOM_CAKE
          : ProductType.BASIC_CAKE;

      // 케이크 옵션에 랜덤 ID 부여 (등록 시에만 생성, 이후에는 변경되지 않음)
      const cakeSizeOptionsWithId = createProductDto.cakeSizeOptions
        ? createProductDto.cakeSizeOptions.map((option) => ({
            ...option,
            id: option.id ?? this.generateOptionId("size"),
          }))
        : [];

      const cakeFlavorOptionsWithId = createProductDto.cakeFlavorOptions
        ? createProductDto.cakeFlavorOptions.map((option) => ({
            ...option,
            id: option.id ?? this.generateOptionId("flavor"),
          }))
        : [];

      // 상품 데이터 준비
      const productData: Prisma.ProductCreateInput = {
        store: {
          connect: {
            id: createProductDto.storeId,
          },
        },
        name: createProductDto.name,
        images: createProductDto.images || [],
        salePrice: createProductDto.salePrice,
        salesStatus: createProductDto.salesStatus,
        visibilityStatus: createProductDto.visibilityStatus,
        // 케이크 옵션을 각각 JSON 배열로 저장
        cakeSizeOptions: cakeSizeOptionsWithId as unknown as Prisma.InputJsonValue,
        cakeFlavorOptions: cakeFlavorOptionsWithId as unknown as Prisma.InputJsonValue,
        letteringVisible: createProductDto.letteringVisible,
        letteringRequired: createProductDto.letteringRequired,
        letteringMaxLength: createProductDto.letteringMaxLength,
        imageUploadEnabled: createProductDto.imageUploadEnabled,
        productType,
        detailDescription: createProductDto.detailDescription,
        productNumber,
        productNoticeFoodType: createProductDto.productNoticeFoodType,
        productNoticeProducer: createProductDto.productNoticeProducer,
        productNoticeOrigin: createProductDto.productNoticeOrigin,
        productNoticeAddress: createProductDto.productNoticeAddress,
        productNoticeManufactureDate: createProductDto.productNoticeManufactureDate,
        productNoticeExpirationDate: createProductDto.productNoticeExpirationDate,
        productNoticePackageCapacity: createProductDto.productNoticePackageCapacity,
        productNoticePackageQuantity: createProductDto.productNoticePackageQuantity,
        productNoticeIngredients: createProductDto.productNoticeIngredients,
        productNoticeCalories: createProductDto.productNoticeCalories,
        productNoticeSafetyNotice: createProductDto.productNoticeSafetyNotice,
        productNoticeGmoNotice: createProductDto.productNoticeGmoNotice,
        productNoticeImportNotice: createProductDto.productNoticeImportNotice,
        productNoticeCustomerService: createProductDto.productNoticeCustomerService,
      };

      // 상품 생성
      const product = await tx.product.create({
        data: productData,
      });

      return {
        id: product.id,
      };
    });
  }

  /**
   * 상품 수정 (판매자용)
   */
  async updateProduct(
    id: string,
    updateProductDto: UpdateProductRequestDto,
    user: JwtVerifiedPayload,
  ) {
    // 상품 존재 여부 및 소유권 확인 (Store 정보 포함)
    const product = await this.prisma.product.findFirst({
      where: {
        id,
      },
      include: {
        store: {
          select: {
            userId: true,
          },
        },
      },
    });

    // 상품이 존재하지 않으면 404 에러
    if (!product || !product.store) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    // 권한 확인: 상품의 Store 소유자인지 확인
    if (product.store.userId !== user.sub) {
      throw new UnauthorizedException(PRODUCT_ERROR_MESSAGES.FORBIDDEN);
    }

    // 업데이트할 데이터 준비
    const updateData: Prisma.ProductUpdateInput = {};

    if (updateProductDto.name !== undefined) {
      updateData.name = updateProductDto.name;
    }
    if (updateProductDto.images !== undefined) {
      updateData.images = updateProductDto.images;
    }
    if (updateProductDto.salePrice !== undefined) {
      updateData.salePrice = updateProductDto.salePrice;
    }
    if (updateProductDto.salesStatus !== undefined) {
      updateData.salesStatus = updateProductDto.salesStatus;
    }
    if (updateProductDto.visibilityStatus !== undefined) {
      updateData.visibilityStatus = updateProductDto.visibilityStatus;
    }
    if (updateProductDto.cakeSizeOptions !== undefined) {
      // 기존 옵션을 조회하여 ID를 유지하고, 새로 추가된 옵션에는 새로운 ID를 부여
      const existingSizeOptions: any[] = (product.cakeSizeOptions as any[]) ?? [];
      const nextSizeOptions = this.processCakeOptionsWithIds(
        existingSizeOptions,
        updateProductDto.cakeSizeOptions ?? [],
        "size",
      );

      // 요청 목록에 없는 기존 옵션은 제거되므로, ID도 함께 제거되는 효과
      updateData.cakeSizeOptions = nextSizeOptions as unknown as Prisma.InputJsonValue;
    }

    if (updateProductDto.cakeFlavorOptions !== undefined) {
      const existingFlavorOptions: any[] = (product.cakeFlavorOptions as any[]) ?? [];
      const nextFlavorOptions = this.processCakeOptionsWithIds(
        existingFlavorOptions,
        updateProductDto.cakeFlavorOptions ?? [],
        "flavor",
      );

      updateData.cakeFlavorOptions = nextFlavorOptions as unknown as Prisma.InputJsonValue;
    }
    if (updateProductDto.letteringVisible !== undefined) {
      updateData.letteringVisible = updateProductDto.letteringVisible;
    }
    if (updateProductDto.letteringRequired !== undefined) {
      updateData.letteringRequired = updateProductDto.letteringRequired;
    }
    if (updateProductDto.letteringMaxLength !== undefined) {
      updateData.letteringMaxLength = updateProductDto.letteringMaxLength;
    }
    if (updateProductDto.imageUploadEnabled !== undefined) {
      updateData.imageUploadEnabled = updateProductDto.imageUploadEnabled;
      // imageUploadEnabled가 변경되면 productType도 자동으로 업데이트
      updateData.productType =
        updateProductDto.imageUploadEnabled === EnableStatus.ENABLE
          ? ProductType.CUSTOM_CAKE
          : ProductType.BASIC_CAKE;
    }
    if (updateProductDto.detailDescription !== undefined) {
      updateData.detailDescription = updateProductDto.detailDescription;
    }
    if (updateProductDto.productNoticeFoodType !== undefined) {
      updateData.productNoticeFoodType = updateProductDto.productNoticeFoodType;
    }
    if (updateProductDto.productNoticeProducer !== undefined) {
      updateData.productNoticeProducer = updateProductDto.productNoticeProducer;
    }
    if (updateProductDto.productNoticeOrigin !== undefined) {
      updateData.productNoticeOrigin = updateProductDto.productNoticeOrigin;
    }
    if (updateProductDto.productNoticeAddress !== undefined) {
      updateData.productNoticeAddress = updateProductDto.productNoticeAddress;
    }
    if (updateProductDto.productNoticeManufactureDate !== undefined) {
      updateData.productNoticeManufactureDate = updateProductDto.productNoticeManufactureDate;
    }
    if (updateProductDto.productNoticeExpirationDate !== undefined) {
      updateData.productNoticeExpirationDate = updateProductDto.productNoticeExpirationDate;
    }
    if (updateProductDto.productNoticePackageCapacity !== undefined) {
      updateData.productNoticePackageCapacity = updateProductDto.productNoticePackageCapacity;
    }
    if (updateProductDto.productNoticePackageQuantity !== undefined) {
      updateData.productNoticePackageQuantity = updateProductDto.productNoticePackageQuantity;
    }
    if (updateProductDto.productNoticeIngredients !== undefined) {
      updateData.productNoticeIngredients = updateProductDto.productNoticeIngredients;
    }
    if (updateProductDto.productNoticeCalories !== undefined) {
      updateData.productNoticeCalories = updateProductDto.productNoticeCalories;
    }
    if (updateProductDto.productNoticeSafetyNotice !== undefined) {
      updateData.productNoticeSafetyNotice = updateProductDto.productNoticeSafetyNotice;
    }
    if (updateProductDto.productNoticeGmoNotice !== undefined) {
      updateData.productNoticeGmoNotice = updateProductDto.productNoticeGmoNotice;
    }
    if (updateProductDto.productNoticeImportNotice !== undefined) {
      updateData.productNoticeImportNotice = updateProductDto.productNoticeImportNotice;
    }
    if (updateProductDto.productNoticeCustomerService !== undefined) {
      updateData.productNoticeCustomerService = updateProductDto.productNoticeCustomerService;
    }

    // 상품 수정
    const updatedProduct = await this.prisma.product.update({
      where: {
        id,
      },
      data: updateData,
    });

    return {
      id: updatedProduct.id,
    };
  }

  /**
   * 상품 삭제 (판매자용)
   */
  async deleteProduct(id: string, user: JwtVerifiedPayload) {
    // 상품 존재 여부 및 소유권 확인 (Store 정보 포함)
    const product = await this.prisma.product.findFirst({
      where: {
        id,
      },
      include: {
        store: {
          select: {
            userId: true,
          },
        },
      },
    });

    // 상품이 존재하지 않으면 404 에러
    if (!product || !product.store) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    // 권한 확인: 상품의 Store 소유자인지 확인
    if (product.store.userId !== user.sub) {
      throw new UnauthorizedException(PRODUCT_ERROR_MESSAGES.FORBIDDEN);
    }

    // 상품 삭제
    await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
