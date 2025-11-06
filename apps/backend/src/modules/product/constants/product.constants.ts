/**
 * 상품 관련 에러 메시지
 */
export const PRODUCT_ERROR_MESSAGES = {
  NOT_FOUND: "상품을 찾을 수 없습니다.",
  FORBIDDEN: "해당 상품을 삭제할 권한이 없습니다.",
} as const;

/**
 * 상품 관련 성공 메시지 상수
 */
export const PRODUCT_SUCCESS_MESSAGES = {
  PRODUCT_DELETED: "상품이 성공적으로 삭제되었습니다.",
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
 * (필터) 메인 카테고리 enum (필수)
 */
export enum MainCategory {
  CAKE = "CAKE",     // 케이크
  SUPPLY = "SUPPLY", // 용품
  OTHER = "OTHER",   // 기타
}

/**
 * (필터) 인원 수 enum
 */
export enum SizeRange {
  ONE_TO_TWO = "ONE_TO_TWO", // 1~2인
  TWO_TO_THREE = "TWO_TO_THREE", // 2~3인
  THREE_TO_FOUR = "THREE_TO_FOUR", // 3~4인
  FOUR_TO_FIVE = "FOUR_TO_FIVE", // 4~5인
  FIVE_OR_MORE = "FIVE_OR_MORE", // 5인 이상
}

/**
 * (필터) 수령 방식 enum
 */
export enum DeliveryMethod {
  PICKUP = "PICKUP",
  DELIVERY = "DELIVERY",
}

/**
 * 상품 상태 enum
 */
export enum ProductStatus {
  ACTIVE = "ACTIVE", // 판매중
  INACTIVE = "INACTIVE", // 판매중지
  OUT_OF_STOCK = "OUT_OF_STOCK", // 품절
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
    description: "달콤한 초콜릿으로 만든 케이크입니다.",
    originalPrice: 50000,
    salePrice: 45000,
    stock: 100, // 재고 수량
    notice: "주문 후 1-2일 내 제작 완료",
    caution: "알레르기 주의: 우유, 계란, 밀 함유",
    basicIncluded: "케이크, 촛불, 포크",
    location: "서울시 강남구",
    likeCount: 25,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    orderFormSchema: {
      title: "케이크 커스터마이징",
      description: "원하시는 옵션을 선택해주세요",
      fields: [
        {
          id: "deliveryMethod",
          type: "select",
          label: "수령 방법",
          required: true,
          options: [
            {
              value: "delivery_cod",
              label: "택배 착불",
              price: 0,
              description: "수령 시 배송비 결제",
            },
            {
              value: "delivery_prepaid",
              label: "택배 선불",
              price: 3000,
              description: "주문 시 배송비 결제",
            },
            {
              value: "pickup",
              label: "직접 수령(지역 픽업)",
              price: 0,
              description: "매장에서 직접 픽업",
            },
            {
              value: "delivery_free",
              label: "택배 50,000원 이상 무료배송",
              price: 0,
              description: "50,000원 이상 구매 시 무료",
            },
          ],
        },
        {
          id: "pickupDateTime",
          type: "datetime-local",
          label: "픽업 날짜시간",
          required: true,
          minDate: "today",
          maxDate: "+30days",
          description: "직접 수령 시 픽업 날짜와 시간을 선택해주세요",
        },
        {
          id: "size",
          type: "select",
          label: "사이즈 선택",
          required: true,
          options: [
            { value: "1호", label: "1호", price: 0 },
            { value: "2호", label: "2호", price: 10000 },
            { value: "3호", label: "3호", price: 20000 },
          ],
        },
        {
          id: "flavor",
          type: "select",
          label: "맛 선택",
          required: true,
          options: [
            { value: "chocolate", label: "초코", price: 0 },
            { value: "vanilla", label: "바닐라", price: 0 },
            { value: "strawberry", label: "딸기", price: 3000 },
          ],
        },
        {
          id: "cakeMessage",
          type: "text",
          label: "케이크 문구입력",
          required: true,
          placeholder: "예: 생일 축하해요!",
          maxLength: 20,
          description: "케이크에 새길 메시지를 입력해주세요 (최대 20자)",
        },
        {
          id: "additionalProducts",
          type: "checkbox",
          label: "추가 구성 상품",
          required: true,
          options: [
            { value: "cakeBox", label: "케이크상자", price: 2000 },
            { value: "candles", label: "캔들 추가", price: 3000 },
            { value: "topper", label: "케이크 토퍼", price: 5000 },
            { value: "messagePlate", label: "글씨 문구 추가", price: 4000 },
          ],
        },
        {
          id: "additionalRequest",
          type: "textarea",
          label: "추가요청",
          required: false,
          placeholder: "특별한 요청사항이 있으시면 입력해주세요",
          maxLength: 200,
          description: "알레르기, 특별한 요청사항 등을 자유롭게 입력해주세요",
        },
      ],
    },
    // 상세 정보
    detailDescription: "<p>고급 초콜릿으로 만든 프리미엄 케이크입니다.</p>",
    // 고시정보 (식품 판매 시 법적 필수 항목)
    productNumber: "CAKE-001",
    foodType: "케이크류",
    producer: "스위트오더",
    manufactureDate: "제조일로부터 3일",
    packageInfo: "1개",
    calories: "350kcal",
    ingredients: "초콜릿, 밀가루, 설탕, 우유, 계란",
    origin: "국내산",
    customerService: "1588-1234",
    // 필터 정보
    mainCategory: MainCategory.CAKE,
    sizeRange: [SizeRange.ONE_TO_TWO, SizeRange.TWO_TO_THREE],
    deliveryMethod: [DeliveryMethod.PICKUP, DeliveryMethod.DELIVERY],
    // 해시태그
    hashtags: ["케이크", "초콜릿", "생일", "기념일"],
    // 상품 상태
    status: ProductStatus.ACTIVE,
    // 기타
    isLiked: false,
    // 판매자 정보 (Store를 통해 User(Seller) 참조)
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
