import {
  EnableStatus,
  OptionRequired,
  CakeSizeDisplayName,
  ProductCategoryType,
} from "@/apps/web-seller/features/product/types/product.type";

export const PRODUCT_ERROR_MESSAGES = {
  MAIN_IMAGE_REQUIRED: "상품 대표 이미지를 등록해주세요.",
  NAME_REQUIRED: "상품명을 입력해주세요.",
  SALES_STATUS_REQUIRED: "판매 여부를 선택해주세요.",
  VISIBILITY_STATUS_REQUIRED: "노출 여부를 선택해주세요.",
  SALE_PRICE_REQUIRED: "판매가를 입력해주세요.",
  SALE_PRICE_INVALID: "판매가는 0보다 큰 숫자여야 합니다.",
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
  CAKE_SIZE_LENGTH_CM_REQUIRED: "케이크 사이즈의 길이(cm)를 입력해주세요.",
  CAKE_SIZE_LENGTH_CM_INVALID: "케이크 사이즈의 길이(cm)는 0보다 큰 숫자여야 합니다.",
  CAKE_SIZE_PRICE_REQUIRED: "케이크 사이즈의 가격을 입력해주세요.",
  CAKE_SIZE_PRICE_INVALID: "케이크 사이즈의 가격은 0 이상의 숫자여야 합니다.",
  CAKE_FLAVOR_PRICE_REQUIRED: "케이크 맛의 가격을 입력해주세요.",
  CAKE_FLAVOR_PRICE_INVALID: "케이크 맛의 가격은 0 이상의 숫자여야 합니다.",
} as const;

export const PRODUCT_SUCCESS_MESSAGES = {
  PRODUCT_CREATED: "상품이 등록되었습니다.",
  PRODUCT_UPDATED: "상품이 수정되었습니다.",
  PRODUCT_DELETED: "상품이 삭제되었습니다.",
} as const;

export const SALES_STATUS_OPTIONS = [
  { value: EnableStatus.ENABLE, label: "판매중" },
  { value: EnableStatus.DISABLE, label: "판매중지" },
] as const;

export const VISIBILITY_STATUS_OPTIONS = [
  { value: EnableStatus.ENABLE, label: "노출" },
  { value: EnableStatus.DISABLE, label: "숨김" },
] as const;

export const OPTION_REQUIRED_OPTIONS = [
  { value: OptionRequired.REQUIRED, label: "필수" },
  { value: OptionRequired.OPTIONAL, label: "선택" },
] as const;

export const ENABLE_DISABLE_OPTIONS = [
  { value: EnableStatus.ENABLE, label: "사용" },
  { value: EnableStatus.DISABLE, label: "미사용" },
] as const;

/** 카테고리 타입 그룹별 옵션 (UI: [대상별], [서비스], [디자인]) */
export const PRODUCT_CATEGORY_GROUPS = [
  {
    label: "대상별",
    options: [
      { value: ProductCategoryType.BIRTHDAY, label: "생일" },
      { value: ProductCategoryType.LOVER, label: "연인" },
      { value: ProductCategoryType.FRIEND, label: "친구" },
      { value: ProductCategoryType.FAMILY, label: "가족" },
      { value: ProductCategoryType.ANNIVERSARY, label: "기념일" },
    ],
  },
  {
    label: "서비스",
    options: [
      { value: ProductCategoryType.SAME_DAY_PICKUP, label: "당일픽업" },
      { value: ProductCategoryType.LETTERING, label: "레터링" },
    ],
  },
  {
    label: "디자인",
    options: [
      { value: ProductCategoryType.CHARACTER, label: "캐릭터" },
      { value: ProductCategoryType.SIMPLE, label: "심플" },
      { value: ProductCategoryType.FLOWER, label: "꽃" },
      { value: ProductCategoryType.PHOTO, label: "사진" },
    ],
  },
] as const;

// 케이크 사이즈 표시명 드롭다운 옵션
export const CAKE_SIZE_DISPLAY_NAME_OPTIONS = [
  { value: CakeSizeDisplayName.DOSIRAK, label: "도시락" },
  { value: CakeSizeDisplayName.MINI, label: "미니" },
  { value: CakeSizeDisplayName.SIZE_1, label: "1호" },
  { value: CakeSizeDisplayName.SIZE_2, label: "2호" },
  { value: CakeSizeDisplayName.SIZE_3, label: "3호" },
] as const;
