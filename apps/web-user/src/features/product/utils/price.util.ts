import { OrderFormSchema, OrderFormData } from "@/apps/web-user/features/product/types/product.type";

/**
 * 주문 폼 옵션의 추가 가격을 계산하는 함수
 * @param orderFormSchema - 주문 폼 스키마
 * @param selectedOptions - 선택된 옵션들
 * @returns 추가 가격 합계
 */
export const calculateAdditionalPrice = (
  orderFormSchema: OrderFormSchema | undefined,
  selectedOptions: OrderFormData,
): number => {
  let additionalPrice = 0;

  if (!orderFormSchema?.fields) {
    return additionalPrice;
  }

  orderFormSchema.fields.forEach((field) => {
    if (field.type === "selectbox" && field.options) {
      const selectedValue = selectedOptions[field.id];
      if (selectedValue) {
        if (field.allowMultiple && Array.isArray(selectedValue)) {
          // 다중 선택인 경우
          selectedValue.forEach((value) => {
            const selectedOption = field.options?.find((opt) => opt.value === value);
            if (selectedOption && selectedOption.price !== undefined) {
              additionalPrice += selectedOption.price;
            }
          });
        } else if (
          !field.allowMultiple &&
          typeof selectedValue === "string" &&
          selectedValue !== ""
        ) {
          // 단일 선택인 경우 (빈 문자열 제외)
          const selectedOption = field.options.find((opt) => opt.value === selectedValue);
          if (selectedOption && selectedOption.price !== undefined) {
            additionalPrice += selectedOption.price;
          }
        }
      }
    }
  });

  return additionalPrice;
};

/**
 * 상품의 총 가격을 계산하는 함수
 * 기본 가격 + 주문 폼 옵션의 추가 가격
 * @param basePrice - 기본 상품 가격
 * @param orderFormSchema - 주문 폼 스키마
 * @param selectedOptions - 선택된 옵션들
 * @returns 총 가격
 */
export const calculateTotalPrice = (
  basePrice: number,
  orderFormSchema: OrderFormSchema | undefined,
  selectedOptions: OrderFormData,
): number => {
  const additionalPrice = calculateAdditionalPrice(orderFormSchema, selectedOptions);
  return basePrice + additionalPrice;
};

