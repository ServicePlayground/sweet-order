import {
  MainCategory,
  SizeRange,
  DeliveryMethod,
  ProductStatus,
} from "@/apps/web-seller/features/product/types/product.type";

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
  PRODUCT_NOTICE_FOOD_TYPE_REQUIRED: "식품의 유형을 입력해주세요.",
  PRODUCT_NOTICE_PRODUCER_REQUIRED: "제조사를 입력해주세요.",
  PRODUCT_NOTICE_ORIGIN_REQUIRED: "원산지를 입력해주세요.",
  PRODUCT_NOTICE_ADDRESS_REQUIRED: "소재지를 입력해주세요.",
  PRODUCT_NOTICE_MANUFACTURE_DATE_REQUIRED: "제조연월일을 입력해주세요.",
  PRODUCT_NOTICE_EXPIRATION_DATE_REQUIRED: "소비기한 또는 품질유지기한을 입력해주세요.",
  PRODUCT_NOTICE_PACKAGE_CAPACITY_REQUIRED: "포장단위별 용량/수량을 입력해주세요.",
  PRODUCT_NOTICE_PACKAGE_QUANTITY_REQUIRED: "포장 단위별 수량을 입력해주세요.",
  PRODUCT_NOTICE_INGREDIENTS_REQUIRED: "원재료명 및 함량을 입력해주세요.",
  PRODUCT_NOTICE_CALORIES_REQUIRED: "영양성분을 입력해주세요.",
  PRODUCT_NOTICE_SAFETY_NOTICE_REQUIRED: "소비자안전을 위한 주의사항을 입력해주세요.",
  PRODUCT_NOTICE_GMO_NOTICE_REQUIRED: "유전자변형식품에 해당하는 경우의 표시를 입력해주세요.",
  PRODUCT_NOTICE_IMPORT_NOTICE_REQUIRED: "수입식품의 경우를 입력해주세요.",
  PRODUCT_NOTICE_CUSTOMER_SERVICE_REQUIRED: "고객센터를 입력해주세요.",
} as const;

export const PRODUCT_SUCCESS_MESSAGES = {
  PRODUCT_CREATED: "상품이 등록되었습니다.",
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
] as const;
