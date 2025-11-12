import { NotFoundException, BadRequestException } from "@nestjs/common";
import { CART_ERROR_MESSAGES } from "@apps/backend/modules/cart/constants/cart.constants";
import { OrderFormSchema, OrderFormData } from "@apps/backend/modules/product/type/product.type";

/**
 * 상품 검증을 위한 타입 정의
 */
export interface ProductForValidation {
  id?: string;
  status: string;
  stock: number;
}

/**
 * 상품 존재 여부 확인
 * @param product 상품 객체 (null 또는 undefined 가능)
 * @throws NotFoundException 상품이 존재하지 않을 때
 */
export function validateProductExists(product: ProductForValidation | null | undefined): void {
  if (!product) {
    throw new NotFoundException(CART_ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  }
}

/**
 * 상품 상태 확인 (ACTIVE 상태만 허용)
 * @param product 상품 객체
 * @throws BadRequestException 상품 상태가 ACTIVE가 아닐 때
 */
export function validateProductStatus(product: ProductForValidation): void {
  if (product.status !== "ACTIVE") {
    if (product.status === "INACTIVE") {
      throw new BadRequestException(CART_ERROR_MESSAGES.PRODUCT_INACTIVE);
    } else if (product.status === "OUT_OF_STOCK") {
      throw new BadRequestException(CART_ERROR_MESSAGES.PRODUCT_OUT_OF_STOCK);
    } else {
      throw new BadRequestException(CART_ERROR_MESSAGES.PRODUCT_NOT_AVAILABLE);
    }
  }
}

/**
 * 재고 확인
 * @param product 상품 객체
 * @param quantity 요청 수량
 * @throws BadRequestException 재고가 부족할 때
 */
export function validateProductStock(product: ProductForValidation, quantity: number): void {
  if (product.stock < quantity) {
    throw new BadRequestException(CART_ERROR_MESSAGES.INSUFFICIENT_STOCK);
  }
}

/**
 * 상품 검증 (존재 여부, 상태, 재고)
 * @param product 상품 객체 (null 또는 undefined 가능)
 * @param quantity 요청 수량
 * @throws NotFoundException 상품이 존재하지 않을 때
 * @throws BadRequestException 상품 상태가 ACTIVE가 아니거나 재고가 부족할 때
 */
export function validateProductForCart(
  product: ProductForValidation | null | undefined,
  quantity: number,
): void {
  validateProductExists(product);
  validateProductStatus(product!);
  validateProductStock(product!, quantity);
}

/**
 * orderFormData 검증
 * @param orderFormSchema 상품의 주문 폼 스키마
 * @param orderFormData 사용자가 입력한 주문 폼 데이터
 * @throws BadRequestException 검증 실패 시
 */
export function validateOrderFormData(
  orderFormSchema: OrderFormSchema | null | undefined,
  orderFormData: OrderFormData | null | undefined,
): void {
  // orderFormSchema가 없으면 orderFormData도 없어야 함
  if (!orderFormSchema || !orderFormSchema.fields || orderFormSchema.fields.length === 0) {
    if (orderFormData && Object.keys(orderFormData).length > 0) {
      throw new BadRequestException(CART_ERROR_MESSAGES.ORDER_FORM_DATA_INVALID);
    }
    return;
  }

  // orderFormSchema가 있으면 orderFormData가 필요함
  if (!orderFormData || typeof orderFormData !== "object") {
    throw new BadRequestException(CART_ERROR_MESSAGES.ORDER_FORM_DATA_REQUIRED);
  }

  const schemaFields = orderFormSchema.fields;
  const dataKeys = Object.keys(orderFormData);

  // 1. 필수 필드 검증
  for (const field of schemaFields) {
    if (field.required) {
      if (!(field.id in orderFormData)) {
        throw new BadRequestException(
          `${CART_ERROR_MESSAGES.ORDER_FORM_FIELD_REQUIRED}: ${field.label}(${field.id})`,
        );
      }

      const value = orderFormData[field.id];

      // 필수 필드가 비어있으면 안됨
      if (field.type === "textbox") {
        if (typeof value !== "string" || value.trim() === "") {
          throw new BadRequestException(
            `${CART_ERROR_MESSAGES.ORDER_FORM_FIELD_REQUIRED}: ${field.label}(${field.id})`,
          );
        }
      } else if (field.type === "selectbox") {
        if (field.allowMultiple) {
          if (!Array.isArray(value) || value.length === 0) {
            throw new BadRequestException(
              `${CART_ERROR_MESSAGES.ORDER_FORM_FIELD_REQUIRED}: ${field.label}(${field.id})`,
            );
          }
        } else {
          if (typeof value !== "string" || value === "") {
            throw new BadRequestException(
              `${CART_ERROR_MESSAGES.ORDER_FORM_FIELD_REQUIRED}: ${field.label}(${field.id})`,
            );
          }
        }
      }
    }
  }

  // 2. 모든 데이터 키가 스키마에 정의된 필드인지 확인 (옵션 구조 변경 검증)
  for (const key of dataKeys) {
    const field = schemaFields.find((f) => f.id === key);
    if (!field) {
      throw new BadRequestException(
        `${CART_ERROR_MESSAGES.ORDER_FORM_SCHEMA_CHANGED}: 알 수 없는 필드 '${key}'`,
      );
    }

    const value = orderFormData[key];

    // 3. 타입 검증
    if (field.type === "textbox") {
      if (typeof value !== "string") {
        throw new BadRequestException(
          `${CART_ERROR_MESSAGES.ORDER_FORM_FIELD_INVALID}: ${field.label}(${field.id})는 문자열이어야 합니다.`,
        );
      }
    } else if (field.type === "selectbox") {
      if (field.allowMultiple) {
        if (!Array.isArray(value)) {
          throw new BadRequestException(
            `${CART_ERROR_MESSAGES.ORDER_FORM_FIELD_INVALID}: ${field.label}(${field.id})는 배열이어야 합니다.`,
          );
        }
      } else {
        if (typeof value !== "string") {
          throw new BadRequestException(
            `${CART_ERROR_MESSAGES.ORDER_FORM_FIELD_INVALID}: ${field.label}(${field.id})는 문자열이어야 합니다.`,
          );
        }
      }

      // 4. selectbox 옵션 값 검증 (옵션 구조 변경 검증)
      if (field.options && field.options.length > 0) {
        const validValues = field.options.map((opt) => opt.value);
        if (field.allowMultiple && Array.isArray(value)) {
          for (const v of value) {
            if (!validValues.includes(v)) {
              throw new BadRequestException(
                `${CART_ERROR_MESSAGES.ORDER_FORM_SCHEMA_CHANGED}: ${field.label}(${field.id})의 옵션 '${v}'가 더 이상 제공되지 않습니다.`,
              );
            }
          }
        } else if (!field.allowMultiple && typeof value === "string") {
          if (!validValues.includes(value)) {
            throw new BadRequestException(
              `${CART_ERROR_MESSAGES.ORDER_FORM_SCHEMA_CHANGED}: ${field.label}(${field.id})의 옵션 '${value}'가 더 이상 제공되지 않습니다.`,
            );
          }
        }
      }
    }
  }
}

/**
 * deliveryMethod 검증
 * @param productDeliveryMethods 상품의 수령 방식 배열
 * @param selectedDeliveryMethod 선택한 수령 방식
 * @throws BadRequestException 선택한 수령 방식이 상품의 수령 방식 목록에 없을 때
 */
export function validateDeliveryMethod(
  productDeliveryMethods: string[] | null | undefined,
  selectedDeliveryMethod: string | null | undefined,
): void {
  // 상품에 수령 방식이 없으면 선택한 수령 방식도 없어야 함
  if (!productDeliveryMethods || productDeliveryMethods.length === 0) {
    if (selectedDeliveryMethod) {
      throw new BadRequestException(CART_ERROR_MESSAGES.DELIVERY_METHOD_INVALID);
    }
    return;
  }

  // 상품에 수령 방식이 있으면 선택한 수령 방식이 필요함
  if (!selectedDeliveryMethod) {
    throw new BadRequestException(CART_ERROR_MESSAGES.DELIVERY_METHOD_REQUIRED);
  }

  // 선택한 수령 방식이 상품의 수령 방식 목록에 포함되어 있는지 확인
  if (!productDeliveryMethods.includes(selectedDeliveryMethod)) {
    throw new BadRequestException(CART_ERROR_MESSAGES.DELIVERY_METHOD_INVALID);
  }
}
