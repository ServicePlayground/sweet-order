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
        visible: EnableStatus.ENABLE,
        displayName: "미니(10cm)",
        description: "1~2인용",
      },
      {
        visible: EnableStatus.ENABLE,
        displayName: "1호 (15cm)",
        description: "2~3인용",
      },
    ],
    cakeFlavorOptions: [
      {
        visible: EnableStatus.ENABLE,
        displayName: "초콜릿",
      },
      {
        visible: EnableStatus.ENABLE,
        displayName: "바닐라",
      },
    ],
    letteringVisible: EnableStatus.ENABLE,
    letteringRequired: OptionRequired.OPTIONAL,
    letteringMaxLength: 20,
    imageUploadEnabled: EnableStatus.ENABLE,
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
 * Swagger 응답 예시 데이터
 * 복합 응답 구조를 위한 예시 데이터를 제공합니다.
 */
export const SWAGGER_RESPONSE_EXAMPLES = {
  PRODUCT_LIST_RESPONSE: {
    data: [SWAGGER_EXAMPLES.PRODUCT_DATA],
    meta: SWAGGER_EXAMPLES.PAGINATION_META,
  },
  PRODUCT_DETAIL_RESPONSE: {
    ...SWAGGER_EXAMPLES.PRODUCT_DATA,
  },
} as const;
