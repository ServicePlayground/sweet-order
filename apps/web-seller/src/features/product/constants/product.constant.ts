export const PRODUCT_ERROR_MESSAGES = {
  MAIN_CATEGORY_REQUIRED: "카테고리를 선택해주세요.",
  IMAGE_URLS_REQUIRED: "상품 대표 이미지를 등록해주세요.",
  NAME_REQUIRED: "상품명을 입력해주세요.",
} as const;

export const MAIN_CATEGORY_OPTIONS = [
  { value: "CAKE", label: "케이크" },
  { value: "SUPPLY", label: "용품" },
  { value: "OTHER", label: "기타" },
] as const;

