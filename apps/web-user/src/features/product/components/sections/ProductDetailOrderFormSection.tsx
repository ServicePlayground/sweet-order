"use client";

import { useState, useMemo } from "react";
import { Product } from "@/apps/web-user/features/product/types/product.type";
import { Button } from "@/apps/web-user/common/components/buttons/Button";

interface ProductDetailOrderFormSectionProps {
  product: Product;
}

export function ProductDetailOrderFormSection({ product }: ProductDetailOrderFormSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
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
                            onMouseEnter={(e) => {
                              if (!isChecked) {
                                e.currentTarget.style.backgroundColor = "#f9fafb";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isChecked) {
                                e.currentTarget.style.backgroundColor = "#ffffff";
                              }
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
                onMouseEnter={(e) => {
                  if (selectedDeliveryMethod !== method) {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedDeliveryMethod !== method) {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                  }
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
              {totalPrice.toLocaleString()}
            </span>
            <span style={{ fontSize: "16px", color: "#6b7280" }}>원</span>
          </div>
        </div>
      )}

      {/* 주문하기 버튼 */}
      {isExpanded && (
        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <Button
            style={{
              flex: 1,
              padding: "16px",
              fontSize: "16px",
              fontWeight: 600,
              borderRadius: "8px",
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
