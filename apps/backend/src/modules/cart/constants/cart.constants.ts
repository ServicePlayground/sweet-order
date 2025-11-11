/**
 * 장바구니 관련 에러 메시지
 */
export const CART_ERROR_MESSAGES = {
  NOT_FOUND: "장바구니 항목을 찾을 수 없습니다.",
  PRODUCT_NOT_FOUND: "상품을 찾을 수 없습니다.",
  INSUFFICIENT_STOCK: "재고가 부족합니다.",
  INVALID_QUANTITY: "수량은 1개 이상이어야 합니다.",
  ORDER_FORM_DATA_REQUIRED: "주문 폼 데이터가 필요합니다.",
  ORDER_FORM_DATA_INVALID: "주문 폼 데이터가 유효하지 않습니다.",
  ORDER_FORM_FIELD_REQUIRED: "필수 주문 폼 필드가 누락되었습니다.",
  ORDER_FORM_FIELD_INVALID: "주문 폼 필드 값이 유효하지 않습니다.",
} as const;

/**
 * 장바구니 관련 성공 메시지 상수
 */
export const CART_SUCCESS_MESSAGES = {
  ITEM_ADDED: "장바구니에 상품이 추가되었습니다.",
  ITEM_UPDATED: "장바구니 항목이 수정되었습니다.",
  ITEM_REMOVED: "장바구니 항목이 삭제되었습니다.",
  CART_CLEARED: "장바구니가 비워졌습니다.",
} as const;

/**
 * Swagger 예시 데이터
 * 실제 API 응답과 일치하는 예시 데이터를 제공합니다.
 */
export const SWAGGER_EXAMPLES = {
  CART_ITEM: {
    id: "cart_123456789",
    userId: "user_123456789",
    productId: "prod_123456789",
    quantity: 2,
    orderFormData: {
      size: "2호",
      additionalProducts: ["cakeBox", "candles"],
      cakeMessage: "생일 축하해요!",
      additionalRequest: "예쁘게 포장해주세요",
    },
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    product: {
      id: "prod_123456789",
      name: "초콜릿 케이크",
      salePrice: 45000,
      stock: 100,
      images: ["https://example.com/image1.jpg"],
      store: {
        id: "store_123456789",
        name: "스위트오더",
      },
    },
  },
} as const;

/**
 * Swagger 응답 예시 데이터
 * 복합 응답 구조를 위한 예시 데이터를 제공합니다.
 */
export const SWAGGER_RESPONSE_EXAMPLES = {
  CART_LIST_RESPONSE: {
    data: [SWAGGER_EXAMPLES.CART_ITEM],
  },
  CART_ITEM_RESPONSE: {
    ...SWAGGER_EXAMPLES.CART_ITEM,
  },
} as const;

