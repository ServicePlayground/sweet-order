import { SWAGGER_EXAMPLES as PRODUCT_SWAGGER_EXAMPLES } from "@apps/backend/modules/product/constants/product.constants";
import { SWAGGER_EXAMPLES as STORE_SWAGGER_EXAMPLES } from "@apps/backend/modules/store/constants/store.constants";
import { SWAGGER_EXAMPLES as USER_SWAGGER_EXAMPLES } from "@apps/backend/modules/auth/constants/auth.constants";

/**
 * 주문 관련 에러 메시지
 */
export const ORDER_ERROR_MESSAGES = {
  NOT_FOUND: "주문을 찾을 수 없습니다.",
  PRODUCT_NOT_FOUND: "상품을 찾을 수 없습니다.",
  PRODUCT_INACTIVE: "판매중지된 상품입니다.",
  PRODUCT_NOT_AVAILABLE: "구매할 수 없는 상품입니다.",
  STORE_NOT_FOUND: "스토어를 찾을 수 없습니다.",
  INVALID_ORDER_ITEMS: "주문 항목이 올바르지 않습니다.",
  INVALID_TOTAL_QUANTITY: "총 수량이 올바르지 않습니다.",
  INVALID_TOTAL_PRICE: "총 금액이 올바르지 않습니다.",
  CANNOT_REVERT_CONFIRMED: "이미 확정된 주문은 대기 상태로 변경할 수 없습니다.",
} as const;

/**
 * 주문 관련 성공 메시지 상수
 */
export const ORDER_SUCCESS_MESSAGES = {
  ORDER_CREATED: "주문이 성공적으로 생성되었습니다.",
} as const;

/**
 * 주문 상태 enum
 */
export enum OrderStatus {
  PENDING = "PENDING", // 대기중 (예약신청)
  CONFIRMED = "CONFIRMED", // 확정됨 (예약확정)
}

/**
 * 주문 정렬 타입 enum
 */
export enum OrderSortBy {
  LATEST = "LATEST", // 최신순
  OLDEST = "OLDEST", // 오래된순
  PRICE_DESC = "PRICE_DESC", // 금액 높은순
  PRICE_ASC = "PRICE_ASC", // 금액 낮은순
}

/**
 * 주문 타입 enum (픽업 예정/지난 예약)
 */
export enum OrderType {
  UPCOMING = "UPCOMING", // 픽업 예정
  PAST = "PAST", // 지난 예약
}

/**
 * Swagger 예시 데이터
 */
const ORDER_ITEM_EXAMPLE = {
  id: "QXZw02vBqVXNQ29c4w9n9ZdH",
  orderId: "QXZw02vBqVXNQ29c4w9n9ZdG", // 주문 ID (관계 필드)
  pickupDate: new Date("2024-01-15T14:00:00.000Z"),
  // 사이즈 옵션 정보
  sizeId: "size_abcd1234",
  sizeDisplayName: "도시락",
  sizeLengthCm: 8,
  sizeDescription: "1인용",
  sizePrice: 25000,
  // 맛 옵션 정보
  flavorId: "flavor_efgh5678",
  flavorDisplayName: "초콜릿",
  flavorPrice: 10000,
  // 기타 옵션
  letteringMessage: "생일 축하해",
  requestMessage: "케이크 박스에 리본 부탁드려요",
  quantity: 1,
  itemPrice: 85000, // 기본 가격(50000) + 사이즈(25000) + 맛(10000)
  imageUrls: [],
  createdAt: new Date("2024-01-15T12:00:00.000Z"),
  updatedAt: new Date("2024-01-15T12:00:00.000Z"),
} as const;

export const SWAGGER_EXAMPLES = {
  ORDER_DATA: {
    id: "QXZw02vBqVXNQ29c4w9n9ZdG",
    orderNumber: "ORD-20240101-001",
    userId: USER_SWAGGER_EXAMPLES.USER_DATA.id,
    productId: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.id,
    storeId: STORE_SWAGGER_EXAMPLES.ID,
    totalQuantity: 2,
    totalPrice: 140000,
    pickupAddress: "서울특별시 강남구 역삼동 456-789",
    pickupRoadAddress: "서울특별시 강남구 테헤란로 123",
    pickupZonecode: STORE_SWAGGER_EXAMPLES.ZONECODE,
    pickupLatitude: STORE_SWAGGER_EXAMPLES.LATITUDE,
    pickupLongitude: STORE_SWAGGER_EXAMPLES.LONGITUDE,
    orderStatus: OrderStatus.PENDING,
    orderItems: [ORDER_ITEM_EXAMPLE],
    createdAt: new Date("2024-01-01T12:00:00.000Z"),
    updatedAt: new Date("2024-01-01T12:00:00.000Z"),
  },
  ORDER_ITEM: ORDER_ITEM_EXAMPLE,
} as const;
