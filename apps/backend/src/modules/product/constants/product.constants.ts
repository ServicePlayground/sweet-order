/**
 * 상품 관련 에러 메시지
 */
export const PRODUCT_ERROR_MESSAGES = {
  NOT_FOUND: "상품을 찾을 수 없습니다.",
  FORBIDDEN: "해당 상품을 삭제할 권한이 없습니다.",
  STORE_NOT_FOUND: "스토어를 찾을 수 없습니다.",
  STORE_NOT_OWNED: "해당 스토어에 대한 권한이 없습니다.",
  LIKE_ALREADY_EXISTS: "이미 좋아요한 상품입니다.",
  LIKE_NOT_FOUND: "좋아요한 상품이 아닙니다.",
  PRODUCT_INACTIVE: "판매중지된 상품입니다.",
  PRODUCT_OUT_OF_STOCK: "품절된 상품입니다.",
  PRODUCT_NOT_AVAILABLE: "구매할 수 없는 상품입니다.",
  REVIEW_NOT_FOUND: "후기를 찾을 수 없습니다.",
} as const;

/**
 * 상품 관련 성공 메시지 상수
 */
export const PRODUCT_SUCCESS_MESSAGES = {
  PRODUCT_CREATED: "상품이 성공적으로 등록되었습니다.",
  PRODUCT_UPDATED: "상품이 성공적으로 수정되었습니다.",
  PRODUCT_DELETED: "상품이 성공적으로 삭제되었습니다.",
  LIKE_ADDED: "상품에 좋아요를 추가했습니다.",
  LIKE_REMOVED: "상품 좋아요를 취소했습니다.",
} as const;

/**
 * 정렬 enum
 */
export enum SortBy {
  LATEST = "latest", // 최신순(생성일 내림차순)
  PRICE_ASC = "price_asc", // 가격 오름차순
  PRICE_DESC = "price_desc", // 가격 내림차순
  POPULAR = "popular", // 인기순(좋아요 수 내림차순)
  REVIEW_COUNT = "review_count", // 후기 많은 순(후기 수 내림차순)
  RATING_AVG = "rating_avg", // 별점 높은 순(평균 별점 내림차순)
}

/**
 * 후기 정렬 enum
 */
export enum ReviewSortBy {
  LATEST = "latest", // 최신순(생성일 내림차순)
  RATING_DESC = "rating_desc", // 별점 내림차순
  RATING_ASC = "rating_asc", // 별점 오름차순
}

/**
 * 옵션 필수/선택 enum
 */
export enum OptionRequired {
  REQUIRED = "REQUIRED", // 필수
  OPTIONAL = "OPTIONAL", // 선택
}

export enum EnableStatus {
  ENABLE = "ENABLE", // 사용
  DISABLE = "DISABLE", // 미사용
}

export enum ProductType {
  BASIC_CAKE = "BASIC_CAKE", // 기본 케이크
  CUSTOM_CAKE = "CUSTOM_CAKE", // 커스텀 케이크
}

/**
 * 케이크 사이즈 표시명 enum
 */
export enum CakeSizeDisplayName {
  MINI = "미니",
  SIZE_1 = "1호",
  SIZE_2 = "2호",
  SIZE_3 = "3호",
  SIZE_4 = "4호",
  SIZE_5 = "5호",
  SIZE_6 = "6호",
  SIZE_7 = "7호",
}

/**
 * Swagger 예시 데이터
 * 실제 API 응답과 일치하는 예시 데이터를 제공합니다.
 */
export const SWAGGER_EXAMPLES = {
  PRODUCT_DATA: {
    id: "prod_123456789",
    // 상품 정보
    name: "초콜릿 케이크",
    salePrice: 45000,
    likeCount: 25,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    cakeSizeOptions: [
      {
        id: "size_abcd1234",
        visible: EnableStatus.ENABLE,
        displayName: CakeSizeDisplayName.MINI,
        lengthCm: 10,
        price: 30000,
        description: "1~2인용",
      },
      {
        id: "size_efgh5678",
        visible: EnableStatus.ENABLE,
        displayName: CakeSizeDisplayName.SIZE_1,
        lengthCm: 15,
        price: 35000,
        description: "2~3인용",
      },
    ],
    cakeFlavorOptions: [
      {
        id: "flavor_ijkl9012",
        visible: EnableStatus.ENABLE,
        displayName: "초콜릿",
        price: 10000,
      },
      {
        id: "flavor_mnop3456",
        visible: EnableStatus.ENABLE,
        displayName: "바닐라",
        price: 20000,
      },
    ],
    letteringVisible: EnableStatus.ENABLE,
    letteringRequired: OptionRequired.OPTIONAL,
    letteringMaxLength: 20,
    imageUploadEnabled: EnableStatus.ENABLE,
    productType: "CUSTOM_CAKE",
    // 상세 정보
    detailDescription: "<p>고급 초콜릿으로 만든 프리미엄 케이크입니다.</p>",
    // 고시정보 (식품 판매 시 법적 필수 항목)
    productNumber: "CAKE-001",
    productNoticeFoodType: "케이크류",
    productNoticeProducer: "스위트오더",
    productNoticeOrigin: "국내산",
    productNoticeAddress: "서울시 강남구 테헤란로 123",
    productNoticeManufactureDate: "2024-01-01",
    productNoticeExpirationDate: "제조일로부터 3일",
    productNoticePackageCapacity: "500g",
    productNoticePackageQuantity: "1개",
    productNoticeIngredients: "초콜릿, 밀가루, 설탕, 우유, 계란",
    productNoticeCalories: "칼로리: 350kcal, 탄수화물: 45g, 단백질: 5g, 지방: 15g",
    productNoticeSafetyNotice: "알레르기 주의: 우유, 계란, 밀 함유",
    productNoticeGmoNotice: "해당사항 없음",
    productNoticeImportNotice: "해당사항 없음",
    productNoticeCustomerService: "1588-1234",
    images: [
      "https://example.com/main-image.jpg",
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
    salesStatus: EnableStatus.ENABLE,
    visibilityStatus: EnableStatus.ENABLE,
    storeId: "store_123456789",
  },
  PAGINATION_META: {
    currentPage: 1,
    limit: 30,
    totalItems: 150,
    totalPages: 8,
    hasNext: true,
    hasPrev: false,
  },
} as const;

/**
 * Seed용 상품/리뷰 상수
 * 값은 prisma seed에서 사용하는 값과 동일하게 유지한다.
 */
export const SEED_PRODUCT_BASE = {
  NAME: "프리미엄 초콜릿 케이크",
  IMAGES: [
    "https://static-staging.sweetorders.com/uploads/1__1770124383061_4d54e9eb.jpeg",
    "https://static-staging.sweetorders.com/uploads/2__1770124399509_6f9e0688.jpeg",
  ],
  SALE_PRICE: 45000,
  DETAIL_DESCRIPTION: "<p>고급 초콜릿으로 만든 프리미엄 케이크입니다.</p>",
  PRODUCT_NOTICE: {
    FOOD_TYPE: "케이크류",
    PRODUCER: "스위트오더",
    ORIGIN: "국내산",
    ADDRESS: "서울시 강남구 테헤란로 123",
    MANUFACTURE_DATE: "2024-01-01",
    EXPIRATION_DATE: "제조일로부터 3일",
    PACKAGE_CAPACITY: "500g",
    PACKAGE_QUANTITY: "1개",
    INGREDIENTS: "초콜릿, 밀가루, 설탕, 우유, 계란",
    CALORIES: "칼로리: 350kcal, 탄수화물: 45g, 단백질: 5g, 지방: 15g",
    SAFETY_NOTICE: "알레르기 주의: 우유, 계란, 밀 함유",
    GMO_NOTICE: "해당사항 없음",
    IMPORT_NOTICE: "해당사항 없음",
    CUSTOMER_SERVICE: "1588-1234",
  },
  SIZE_OPTIONS: [
    {
      id: "size_seed_mini",
      visible: EnableStatus.ENABLE as const,
      displayName: CakeSizeDisplayName.MINI,
      lengthCm: 10,
      price: 30000,
      description: "1~2인용",
    },
    {
      id: "size_seed_1ho",
      visible: EnableStatus.ENABLE as const,
      displayName: CakeSizeDisplayName.SIZE_1,
      lengthCm: 15,
      price: 35000,
      description: "2~3인용",
    },
  ],
  FLAVOR_OPTIONS: [
    {
      id: "flavor_seed_choco",
      visible: EnableStatus.ENABLE as const,
      displayName: "초콜릿",
      price: 2000,
    },
    {
      id: "flavor_seed_vanilla",
      visible: EnableStatus.ENABLE as const,
      displayName: "바닐라",
      price: 3000,
    },
  ],
  LETTERING: {
    VISIBLE: EnableStatus.ENABLE as const,
    REQUIRED: OptionRequired.OPTIONAL as const,
    MAX_LENGTH: 20,
  },
} as const;

export const SEED_REVIEW_CONTENTS = [
  "정말 맛있었어요! 다음에도 주문할게요.",
  "배송도 빠르고 상품도 좋아요. 추천합니다!",
  "생각보다 작았지만 맛은 좋았어요.",
  "가격 대비 만족도가 높아요.",
  "케이크가 너무 예뻐서 생일 파티에 완벽했어요!",
  "친구들이 다 맛있다고 했어요.",
  "다음에 또 주문할 예정입니다.",
  "포장도 깔끔하고 상품 상태도 좋았어요.",
] as const;

export const SEED_PRODUCT_IMAGES = {
  FIRST_STORE_REVIEW_IMAGE:
    "https://static-staging.sweetorders.com/uploads/2__1770124399509_6f9e0688.jpeg",
  SECOND_STORE_REVIEW_IMAGE:
    "https://static-staging.sweetorders.com/uploads/3__1770124435469_83ac03cc.jpeg",
} as const;
