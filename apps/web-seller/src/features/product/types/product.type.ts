export enum MainCategory {
  CAKE = "CAKE", // 케이크
  SUPPLY = "SUPPLY", // 용품
  OTHER = "OTHER", // 기타
}

export enum SizeRange {
  ONE_TO_TWO = "ONE_TO_TWO", // 1~2인
  TWO_TO_THREE = "TWO_TO_THREE", // 2~3인
  THREE_TO_FOUR = "THREE_TO_FOUR", // 3~4인
  FOUR_TO_FIVE = "FOUR_TO_FIVE", // 4~5인
  FIVE_OR_MORE = "FIVE_OR_MORE", // 5인 이상
}

export enum DeliveryMethod {
  PICKUP = "PICKUP", // 방문수령
  DELIVERY = "DELIVERY", // 택배
}

export enum ProductStatus {
  ACTIVE = "ACTIVE", // 판매중
  INACTIVE = "INACTIVE", // 판매중지(비공개)
  OUT_OF_STOCK = "OUT_OF_STOCK", // 품절
}

// 커스텀 주문양식 필드 타입
export type OrderFormFieldType = "selectbox" | "textbox" | "checkbox" | "textarea";

// 커스텀 주문양식 옵션
export interface OrderFormOption {
  value: string;
  label: string;
  price?: number; // 추가 가격 (선택사항)
}

// 커스텀 주문양식 필드
export interface OrderFormField {
  id: string;
  type: OrderFormFieldType;
  label: string;
  required: boolean;
  placeholder?: string; // textbox, textarea용
  options?: OrderFormOption[]; // selectbox, checkbox용
}

// 커스텀 주문양식 스키마
export interface OrderFormSchema {
  fields: OrderFormField[];
}

export interface IProductForm {
  // 기본 정보
  mainCategory: MainCategory | "";
  imageUrls: string[];
  name: string;
  description?: string;
  originalPrice: number | "";
  salePrice: number | "";
  notice?: string;
  caution?: string;
  basicIncluded?: string;

  // 커스텀 주문양식
  orderFormSchema?: OrderFormSchema;

  // 상세정보 (추후 구현)
  detailDescription?: string;

  // 보이지 않는 부분
  stock: number | "";
  sizeRange: SizeRange[];
  deliveryMethod: DeliveryMethod[];
  hashtags: string[];
  status: ProductStatus;
}

