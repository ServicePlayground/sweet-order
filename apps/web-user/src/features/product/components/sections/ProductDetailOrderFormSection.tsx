"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Product, OrderFormData } from "@/apps/web-user/features/product/types/product.type";
import { Button } from "@/apps/web-user/common/components/buttons/Button";
import { useAddCartItem } from "@/apps/web-user/features/cart/hooks/mutations/useAddCartItem";
import { useAuthStore } from "@/apps/web-user/features/auth/store/auth.store";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";

interface ProductDetailOrderFormSectionProps {
  product: Product;
}

export function ProductDetailOrderFormSection({ product }: ProductDetailOrderFormSectionProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { showAlert } = useAlertStore();
  const addCartItemMutation = useAddCartItem();
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<string | null>(
    product.deliveryMethod && product.deliveryMethod.length > 0 ? product.deliveryMethod[0] : null,
  );

  // 주문 폼 옵션 선택 상태 관리
  const orderFormSchema = product.orderFormSchema;
  const initialOptionValues = useMemo(() => {
    if (!orderFormSchema?.fields) return {};
    const values: Record<string, string | string[]> = {};
    orderFormSchema.fields.forEach((field) => {
      if (field.type === "selectbox") {
        if (field.required && field.options && field.options.length > 0) {
          if (field.allowMultiple) {
            values[field.id] = [field.options[0].value];
          } else {
            values[field.id] = field.options[0].value;
          }
        } else if (field.allowMultiple) {
          values[field.id] = [];
        }
      } else if (field.type === "textbox") {
        if (field.required) {
          values[field.id] = "";
        }
      }
    });
    return values;
  }, [orderFormSchema]);

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string | string[]>>(initialOptionValues);

  const getDeliveryMethodLabel = (method: string) => {
    if (method === "PICKUP" || method === "pickup") return "픽업";
    if (method === "DELIVERY" || method === "delivery") return "배송";
    return method;
  };

  // 총 가격 계산
  const totalPrice = useMemo(() => {
    let additionalPrice = 0;
    if (orderFormSchema?.fields) {
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
    }
    return product.salePrice + additionalPrice;
  }, [product.salePrice, selectedOptions, orderFormSchema]);

  const handleOptionChange = (fieldId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleMultipleOptionChange = (fieldId: string, value: string, checked: boolean) => {
    setSelectedOptions((prev) => {
      const currentValues = (prev[fieldId] as string[]) || [];
      if (checked) {
        return {
          ...prev,
          [fieldId]: [...currentValues, value],
        };
      } else {
        return {
          ...prev,
          [fieldId]: currentValues.filter((v) => v !== value),
        };
      }
    });
  };

  const handleTextboxChange = (fieldId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // 주문 폼 검증
  const validateOrderForm = (): boolean => {
    if (!orderFormSchema?.fields) return true;

    for (const field of orderFormSchema.fields) {
      if (field.required) {
        const value = selectedOptions[field.id];
        if (!value || (typeof value === "string" && value.trim() === "") || (Array.isArray(value) && value.length === 0)) {
          return false;
        }
      }
    }
    return true;
  };

  // 장바구니 추가 핸들러
  const handleAddToCart = async () => {
    // 로그인 체크
    if (!isAuthenticated) {
      router.push(PATHS.AUTH.LOGIN);
      return;
    }

    // 주문 폼 검증
    if (!validateOrderForm()) {
      showAlert({
        type: "error",
        title: "오류",
        message: "필수 항목을 모두 입력해주세요.",
      });
      return;
    }

    // 재고 체크
    if (product.stock < quantity) {
      showAlert({
        type: "error",
        title: "오류",
        message: "재고가 부족합니다.",
      });
      return;
    }

    // orderFormData 구성 (빈 값 제외)
    const orderFormData: OrderFormData = {};
    if (orderFormSchema?.fields) {
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
    }

    // 장바구니 추가
    try {
      await addCartItemMutation.mutateAsync({
        productId: product.id,
        quantity,
        orderFormData: Object.keys(orderFormData).length > 0 ? orderFormData : undefined,
      });
    } catch (error) {
      // 에러는 useAddCartItem에서 이미 처리됨
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f9fafb",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "18px",
          fontWeight: 700,
          color: "#111827",
          marginBottom: isExpanded ? "20px" : "0",
          cursor: "pointer",
          padding: "4px 0",
          userSelect: "none",
        }}
      >
        <span>주문하기</span>
        <span
          style={{
            fontSize: "20px",
            color: "#6b7280",
            transition: "transform 0.2s ease",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </span>
      </div>

      {/* 옵션 선택 */}
      {isExpanded && orderFormSchema?.fields && orderFormSchema.fields.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orderFormSchema.fields.map((field) => (
            <div key={field.id} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                {field.label}
                {field.required && <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>}
              </label>
              {field.type === "selectbox" && field.options && (
                <>
                  {field.allowMultiple ? (
                    // 다중 선택 (체크박스)
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {field.options.map((option) => {
                        const currentValues = (selectedOptions[field.id] as string[]) || [];
                        const isChecked = currentValues.includes(option.value);
                        return (
                          <label
                            key={option.value}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "12px",
                              borderRadius: "8px",
                              border: `1px solid ${isChecked ? "#3b82f6" : "#e5e7eb"}`,
                              backgroundColor: isChecked ? "#eff6ff" : "#ffffff",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) =>
                                handleMultipleOptionChange(field.id, option.value, e.target.checked)
                              }
                              style={{
                                width: "18px",
                                height: "18px",
                                cursor: "pointer",
                                accentColor: "#3b82f6",
                              }}
                            />
                            <span
                              style={{
                                fontSize: "14px",
                                color: "#374151",
                                fontWeight: isChecked ? 600 : 400,
                                flex: 1,
                              }}
                            >
                              {option.label}
                              {option.price !== undefined && option.price > 0 && (
                                <span style={{ color: "#6b7280", marginLeft: "4px" }}>
                                  (+{option.price.toLocaleString()}원)
                                </span>
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    // 단일 선택 (드롭다운)
                    <select
                      value={
                        typeof selectedOptions[field.id] === "string" &&
                        selectedOptions[field.id] !== undefined
                          ? (selectedOptions[field.id] as string)
                          : ""
                      }
                      onChange={(e) => handleOptionChange(field.id, e.target.value)}
                      required={field.required}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                        fontSize: "14px",
                        color: "#374151",
                        cursor: "pointer",
                        outline: "none",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#3b82f6";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                      }}
                    >
                      {!field.required && <option value="">선택해주세요</option>}
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                          {option.price !== undefined && option.price > 0
                            ? ` (+${option.price.toLocaleString()}원)`
                            : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </>
              )}
              {field.type === "textbox" && (
                <input
                  type="text"
                  value={
                    typeof selectedOptions[field.id] === "string" &&
                    selectedOptions[field.id] !== undefined
                      ? (selectedOptions[field.id] as string)
                      : ""
                  }
                  onChange={(e) => handleTextboxChange(field.id, e.target.value)}
                  placeholder={field.placeholder || ""}
                  required={field.required}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#ffffff",
                    fontSize: "14px",
                    color: "#374151",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* 수령 방법 선택 */}
      {isExpanded && product.deliveryMethod && product.deliveryMethod.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            수령 방법
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {product.deliveryMethod.map((method) => (
              <label
                key={method}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${selectedDeliveryMethod === method ? "#3b82f6" : "#e5e7eb"}`,
                  backgroundColor: selectedDeliveryMethod === method ? "#eff6ff" : "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value={method}
                  checked={selectedDeliveryMethod === method}
                  onChange={(e) => setSelectedDeliveryMethod(e.target.value)}
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                    accentColor: "#3b82f6",
                  }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    color: "#374151",
                    fontWeight: selectedDeliveryMethod === method ? 600 : 400,
                  }}
                >
                  {getDeliveryMethodLabel(method)}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 수량 선택 */}
      {isExpanded && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <label
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#374151",
            }}
          >
            수량
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                backgroundColor: quantity <= 1 ? "#f5f5f5" : "#ffffff",
                color: quantity <= 1 ? "#9ca3af" : "#374151",
                cursor: quantity <= 1 ? "not-allowed" : "pointer",
                fontSize: "18px",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value) && value >= 1) {
                  setQuantity(value);
                }
              }}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                fontSize: "16px",
                fontWeight: 600,
                color: "#374151",
                textAlign: "center",
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3b82f6";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                if (quantity < 1) setQuantity(1);
                if (quantity > product.stock) setQuantity(product.stock);
              }}
            />
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
              disabled={quantity >= product.stock}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                backgroundColor: quantity >= product.stock ? "#f5f5f5" : "#ffffff",
                color: quantity >= product.stock ? "#9ca3af" : "#374151",
                cursor: quantity >= product.stock ? "not-allowed" : "pointer",
                fontSize: "18px",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* 총 가격 */}
      {isExpanded && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0",
            marginTop: "20px",
            borderTop: "2px solid #e5e7eb",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            총 가격
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {(totalPrice * quantity).toLocaleString()}
            </span>
            <span style={{ fontSize: "16px", color: "#6b7280" }}>원</span>
          </div>
        </div>
      )}

      {/* 주문하기 및 장바구니 버튼 */}
      {isExpanded && (
        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <Button
            style={{
              flex: 1,
              padding: "16px",
              fontSize: "16px",
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              color: "#111827",
              border: "1px solid #e5e7eb",
            }}
            disabled={product.stock === 0 || addCartItemMutation.isPending}
            onClick={handleAddToCart}
          >
            {addCartItemMutation.isPending ? "처리 중..." : "장바구니 담기"}
          </Button>
          <Button
            style={{
              flex: 1,
              padding: "16px",
              fontSize: "16px",
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: "#000000",
              color: "#ffffff",
            }}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "품절" : "주문하기"}
          </Button>
        </div>
      )}
    </div>
  );
}
