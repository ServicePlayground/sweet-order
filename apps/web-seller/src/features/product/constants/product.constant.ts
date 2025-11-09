import { MainCategory, SizeRange, DeliveryMethod, ProductStatus } from "@/apps/web-seller/features/product/types/product.type";

export const PRODUCT_ERROR_MESSAGES = {
  MAIN_CATEGORY_REQUIRED: "카테고리를 선택해주세요.",
  IMAGE_URLS_REQUIRED: "상품 대표 이미지를 등록해주세요.",
  NAME_REQUIRED: "상품명을 입력해주세요.",
  ORIGINAL_PRICE_REQUIRED: "정가를 입력해주세요.",
  ORIGINAL_PRICE_INVALID: "정가는 0보다 큰 숫자여야 합니다.",
  SALE_PRICE_REQUIRED: "판매가를 입력해주세요.",
  SALE_PRICE_INVALID: "판매가는 0보다 큰 숫자여야 합니다.",
  SALE_PRICE_HIGHER_THAN_ORIGINAL: "판매가는 정가보다 낮거나 같아야 합니다.",
  STOCK_REQUIRED: "재고수량을 입력해주세요.",
  STOCK_INVALID: "재고수량은 1개 이상이어야 합니다.",
  SIZE_RANGE_REQUIRED: "인원 수를 선택해주세요.",
  DELIVERY_METHOD_REQUIRED: "배송 방법을 선택해주세요.",
  HASHTAG_MAX: "해시태그는 최대 10개까지 등록할 수 있습니다.",
  ORDER_FORM_FIELD_LABEL_REQUIRED: "필드명을 입력해주세요.",
  ORDER_FORM_FIELD_OPTIONS_REQUIRED: "옵션을 추가해주세요.",
  ORDER_FORM_FIELD_OPTION_LABEL_REQUIRED: "옵션명을 입력해주세요.",
  ORDER_FORM_FIELD_OPTION_VALUE_REQUIRED: "옵션값을 입력해주세요.",
} as const;

export const MAIN_CATEGORY_OPTIONS = [
  { value: MainCategory.CAKE, label: "케이크" },
  { value: MainCategory.SUPPLY, label: "용품" },
  { value: MainCategory.OTHER, label: "기타" },
] as const;

export const SIZE_RANGE_OPTIONS = [
  { value: SizeRange.ONE_TO_TWO, label: "1~2인" },
  { value: SizeRange.TWO_TO_THREE, label: "2~3인" },
  { value: SizeRange.THREE_TO_FOUR, label: "3~4인" },
  { value: SizeRange.FOUR_TO_FIVE, label: "4~5인" },
  { value: SizeRange.FIVE_OR_MORE, label: "5인 이상" },
] as const;

export const DELIVERY_METHOD_OPTIONS = [
  { value: DeliveryMethod.PICKUP, label: "방문수령" },
  { value: DeliveryMethod.DELIVERY, label: "택배" },
] as const;

export const PRODUCT_STATUS_OPTIONS = [
  { value: ProductStatus.ACTIVE, label: "판매중" },
  { value: ProductStatus.INACTIVE, label: "판매중지(비공개)" },
  { value: ProductStatus.OUT_OF_STOCK, label: "품절" },
] as const;

export const ORDER_FORM_FIELD_TYPE_OPTIONS = [
  { value: "selectbox", label: "선택박스" },
  { value: "textbox", label: "텍스트박스" },
  { value: "checkbox", label: "체크박스" },
  { value: "textarea", label: "텍스트영역" },
] as const;
