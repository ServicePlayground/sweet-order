import { OrderFormSchema, OrderFormData, ProductStatus } from "@/apps/web-user/features/product/types/product.type";

/**
 * 상품이 활성 상태(판매중)인지 확인하는 함수
 * @param status - 상품 상태
 * @returns 활성 상태 여부 (true: 활성, false: 비활성)
 */
export const isProductActive = (status: string): boolean => {
  return status === ProductStatus.ACTIVE;
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
 * orderFormData 검증 (백엔드 검증 로직 참고)
 * @param orderFormSchema - 주문 폼 스키마
 * @param orderFormData - 주문 폼 데이터
 * @returns 검증 결과 객체 { isValid: boolean, errorMessage?: string }
 */
export const validateOrderFormData = (
  orderFormSchema: OrderFormSchema | null | undefined,
  orderFormData: OrderFormData | null | undefined,
): { isValid: boolean; errorMessage?: string } => {
  // orderFormSchema가 없으면 orderFormData도 없어야 함
  if (!orderFormSchema || !orderFormSchema.fields || orderFormSchema.fields.length === 0) {
    if (orderFormData && Object.keys(orderFormData).length > 0) {
      return {
        isValid: false,
        errorMessage: "주문 폼 스키마가 없는데 주문 폼 데이터가 제공되었습니다.",
      };
    }
    return { isValid: true };
  }

  // orderFormSchema가 있으면 orderFormData가 필요함
  if (!orderFormData || typeof orderFormData !== "object") {
    return {
      isValid: false,
      errorMessage: "주문 폼 데이터가 필요합니다.",
    };
  }

  const schemaFields = orderFormSchema.fields;
  const dataKeys = Object.keys(orderFormData);

  // 1. 필수 필드 검증
  for (const field of schemaFields) {
    if (field.required) {
      if (!(field.id in orderFormData)) {
        return {
          isValid: false,
          errorMessage: `${field.label} 필수 항목을 입력해주세요`,
        };
      }

      const value = orderFormData[field.id];

      // 필수 필드가 비어있으면 안됨
      if (field.type === "textbox") {
        if (typeof value !== "string" || value.trim() === "") {
          return {
            isValid: false,
            errorMessage: `${field.label}(${field.id}) 필수 항목을 입력해주세요`,
          };
        }
      } else if (field.type === "selectbox") {
        if (field.allowMultiple) {
          if (!Array.isArray(value) || value.length === 0) {
            return {
              isValid: false,
              errorMessage: `${field.label}(${field.id}) 필수 항목을 입력해주세요`,
            };
          }
        } else {
          if (typeof value !== "string" || value === "") {
            return {
              isValid: false,
              errorMessage: `${field.label}(${field.id}) 필수 항목을 입력해주세요`,
            };
          }
        }
      }
    }
  }

  // 2. 모든 데이터 키가 스키마에 정의된 필드인지 확인 (옵션 구조 변경 검증)
  for (const key of dataKeys) {
    const field = schemaFields.find((f) => f.id === key);
    if (!field) {
      return {
        isValid: false,
        errorMessage: `알 수 없는 필드 '${key}'입니다.`,
      };
    }

    const value = orderFormData[key];

    // 3. 타입 검증
    if (field.type === "textbox") {
      if (typeof value !== "string") {
        return {
          isValid: false,
          errorMessage: `${field.label} 문자열이어야 합니다.`,
        };
      }
    } else if (field.type === "selectbox") {
      if (field.allowMultiple) {
        if (!Array.isArray(value)) {
          return {
            isValid: false,
            errorMessage: `${field.label} 배열이어야 합니다.`,
          };
        }
      } else {
        if (typeof value !== "string") {
          return {
            isValid: false,
            errorMessage: `${field.label} 문자열이어야 합니다.`,
          };
        }
      }

      // 4. selectbox 옵션 값 검증 (옵션 구조 변경 검증)
      if (field.options && field.options.length > 0) {
        const validValues = field.options.map((opt) => opt.value);
        if (field.allowMultiple && Array.isArray(value)) {
          for (const v of value) {
            if (!validValues.includes(v)) {
              return {
                isValid: false,
                errorMessage: `${field.label}의 옵션 '${v}'가 더 이상 제공되지 않습니다.`,
              };
            }
          }
        } else if (!field.allowMultiple && typeof value === "string") {
          if (!validValues.includes(value)) {
            return {
              isValid: false,
              errorMessage: `${field.label}의 옵션 '${value}'가 더 이상 제공되지 않습니다.`,
            };
          }
        }
      }
    }
  }

  return { isValid: true };
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

