// 커스텀 주문양식 필드 타입
export type OrderFormFieldType = "selectbox" | "textbox";

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
  placeholder?: string; // textbox용
  allowMultiple?: boolean; // selectbox용 - 중복선택허용
  options?: OrderFormOption[]; // selectbox용
}

// 커스텀 주문양식 스키마
export interface OrderFormSchema {
  fields: OrderFormField[];
}

// 커스텀 주문양식 데이터 타입
// orderFormSchema의 field.id를 키로 하고, string 또는 string[]을 값으로 가집니다.
export type OrderFormData = Record<string, string | string[]>;
