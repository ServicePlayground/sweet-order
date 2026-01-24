import {
  OrderFormSchema,
  OrderFormData,
  SalesStatus,
  OrderFormDisplayItem,
} from "@/apps/web-user/features/product/types/product.type";

/**
 * 디테일한 검증은 백엔드에서 하도록 함
 */

/**
 * 상품이 활성 상태(판매중)인지 확인하는 함수
 * @param salesStatus - 상품 판매 상태
 * @returns 활성 상태 여부 (true: 활성, false: 비활성)
 */
export const isProductActive = (salesStatus: SalesStatus): boolean => {
  return salesStatus === SalesStatus.ENABLE;
};

/**
 * 재고가 충분한지 확인하는 함수
 * @param stock - 현재 재고
 * @param quantity - 주문 수량
 * @returns 재고 충분 여부 (true: 충분, false: 부족)
 */
export const isStockAvailable = (stock: number, quantity: number): boolean => {
  return stock >= quantity && stock > 0;
};

/**
 * selectedOptions에서 orderFormData를 구성하는 함수 (빈 값 제외)
 * @param orderFormSchema - 주문 폼 스키마
 * @param selectedOptions - 선택된 옵션들
 * @returns orderFormData (빈 값이 제외된 데이터)
 */
export const buildOrderFormData = (
  orderFormSchema: OrderFormSchema | undefined,
  selectedOptions: OrderFormData,
): OrderFormData => {
  const orderFormData: OrderFormData = {};
  if (!orderFormSchema?.fields) {
    return orderFormData;
  }

  orderFormSchema.fields.forEach((field) => {
    const value = selectedOptions[field.id];
    if (value !== undefined && value !== null) {
      if (typeof value === "string" && value.trim() !== "") {
        orderFormData[field.id] = value;
      } else if (Array.isArray(value) && value.length > 0) {
        orderFormData[field.id] = value;
      }
    }
  });

  return orderFormData;
};

/**
 * orderFormData를 표시 가능한 형태로 변환하는 함수
 * @param orderFormSchema - 주문 폼 스키마
 * @param orderFormData - 주문 폼 데이터
 * @returns 표시용 아이템 배열
 */
export const getOrderFormDisplayItems = (
  orderFormSchema: OrderFormSchema | null | undefined,
  orderFormData: OrderFormData | null | undefined,
): OrderFormDisplayItem[] => {
  const displayItems: OrderFormDisplayItem[] = [];

  if (!orderFormSchema?.fields || !orderFormData || Object.keys(orderFormData).length === 0) {
    return displayItems;
  }

  Object.entries(orderFormData).forEach(([fieldId, value]) => {
    const field = orderFormSchema.fields.find((f) => f.id === fieldId);
    if (!field) return;

    let displayValue: string;
    let additionalPrice = 0;

    if (field.type === "selectbox" && field.options) {
      if (Array.isArray(value)) {
        // 다중 선택
        const selectedOptions = value
          .map((val) => field.options?.find((opt) => opt.value === val))
          .filter((opt): opt is NonNullable<typeof opt> => opt !== undefined);
        displayValue = selectedOptions.map((opt) => opt.label).join(", ");
        additionalPrice = selectedOptions.reduce((sum, opt) => sum + (opt.price || 0), 0);
      } else {
        // 단일 선택
        const selectedOption = field.options.find((opt) => opt.value === value);
        if (selectedOption) {
          displayValue = selectedOption.label;
          additionalPrice = selectedOption.price || 0;
        } else {
          displayValue = String(value);
        }
      }
    } else {
      // textbox
      displayValue = Array.isArray(value) ? value.join(", ") : String(value);
    }

    displayItems.push({
      fieldId,
      fieldLabel: field.label,
      displayValue,
      additionalPrice,
    });
  });

  return displayItems;
};
