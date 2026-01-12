import {
  EnableStatus,
  OptionRequired,
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
} as const;

export const PRODUCT_SUCCESS_MESSAGES = {
  PRODUCT_CREATED: "상품이 등록되었습니다.",
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
