import React, { useState } from "react";
import {
  OrderFormSchema,
  OrderFormField,
  OrderFormFieldType,
  OrderFormOption,
} from "@/apps/web-seller/features/product/types/product.type";
import { SelectBox } from "@/apps/web-seller/common/components/selectboxs/SelectBox";
import {
  ORDER_FORM_FIELD_TYPE_OPTIONS,
  PRODUCT_ERROR_MESSAGES,
} from "@/apps/web-seller/features/product/constants/product.constant";
import { Button } from "@/apps/web-seller/common/components/ui/button";
import { Input } from "@/apps/web-seller/common/components/ui/input";
import { Label } from "@/apps/web-seller/common/components/ui/label";
import { Card, CardContent } from "@/apps/web-seller/common/components/ui/card";

export interface ProductCreationOrderFormSchemaSectionProps {
  value?: OrderFormSchema;
  onChange?: (schema: OrderFormSchema) => void;
  error?: string;
}

// 상품 등록 폼 - 커스텀 주문양식 섹션
export const ProductCreationOrderFormSchemaSection: React.FC<
  ProductCreationOrderFormSchemaSectionProps
> = ({ value, onChange, error }) => {
  const [fields, setFields] = useState<OrderFormField[]>(value?.fields || []);
  const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({});

  // value prop이 변경되면 내부 state도 업데이트
  React.useEffect(() => {
    if (value?.fields) {
      setFields(value.fields);
    } else {
      setFields([]);
    }
  }, [value]);

  const generateFieldId = () => {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const generateOptionId = () => {
    return `option_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddField = () => {
    const newField: OrderFormField = {
      id: generateFieldId(),
      type: "textbox",
      label: "",
      required: false,
      allowMultiple: false,
    };
    const newFields = [...fields, newField];
    setFields(newFields);
    onChange?.({ fields: newFields });
  };

  const handleRemoveField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    onChange?.({ fields: newFields });
    // 에러도 제거
    const newErrors = { ...fieldErrors };
    delete newErrors[index];
    setFieldErrors(newErrors);
  };

  const handleFieldChange = (index: number, updates: Partial<OrderFormField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
    onChange?.({ fields: newFields });

    // 에러 제거
    if (fieldErrors[index]) {
      const newErrors = { ...fieldErrors };
      delete newErrors[index];
      setFieldErrors(newErrors);
    }
  };

  const handleAddOption = (fieldIndex: number) => {
    const field = fields[fieldIndex];
    const currentOptions = field.options || [];
    const newOption: OrderFormOption = {
      value: generateOptionId(), // value는 자동 생성 (UI에서 입력받지 않음)
      label: "",
      price: 0,
    };
    const newOptions = [...currentOptions, newOption];
    handleFieldChange(fieldIndex, { options: newOptions });
  };

  const handleRemoveOption = (fieldIndex: number, optionIndex: number) => {
    const field = fields[fieldIndex];
    if (!field.options) return;
    const newOptions = field.options.filter((_, i) => i !== optionIndex);
    handleFieldChange(fieldIndex, { options: newOptions });
  };

  const handleOptionChange = (
    fieldIndex: number,
    optionIndex: number,
    updates: Partial<OrderFormOption>,
  ) => {
    const field = fields[fieldIndex];
    if (!field.options) return;
    const newOptions = [...field.options];
    newOptions[optionIndex] = { ...newOptions[optionIndex], ...updates };
    handleFieldChange(fieldIndex, { options: newOptions });
  };

  const validateField = (field: OrderFormField): string | null => {
    if (!field.label.trim()) {
      return PRODUCT_ERROR_MESSAGES.ORDER_FORM_FIELD_LABEL_REQUIRED;
    }

    if (field.type === "selectbox") {
      if (!field.options || field.options.length === 0) {
        return PRODUCT_ERROR_MESSAGES.ORDER_FORM_FIELD_OPTIONS_REQUIRED;
      }

      for (const option of field.options) {
        if (!option.label.trim()) {
          return PRODUCT_ERROR_MESSAGES.ORDER_FORM_FIELD_OPTION_LABEL_REQUIRED;
        }
      }
    }

    return null;
  };

  const validateAll = (): boolean => {
    const errors: Record<number, string> = {};
    fields.forEach((field, index) => {
      const error = validateField(field);
      if (error) {
        errors[index] = error;
      }
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 필드 변경 시 자동 검증
  React.useEffect(() => {
    if (fields.length > 0) {
      validateAll();
    }
    // validateAll은 fields를 사용하지만, setFieldErrors만 호출하므로 무한 루프는 발생하지 않음
  }, [fields]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">커스텀 주문양식</h2>
        <Button variant="outline" onClick={handleAddField} size="sm">
          <span className="mr-2">+</span>
          필드 추가
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-2">
          {error}
        </div>
      )}

      {fields.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
          주문양식 필드를 추가해주세요.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {fields.map((field, fieldIndex) => (
            <Card key={field.id}>
              <CardContent>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold">
                    필드 {fieldIndex + 1}
                  </h3>
                  <button
                    className="text-destructive hover:text-destructive/80 p-1"
                    onClick={() => handleRemoveField(fieldIndex)}
                    aria-label="필드 삭제"
                  >
                    <span className="text-xl">×</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <SelectBox
                        label="필드 타입"
                        value={field.type}
                        onChange={(value) =>
                          handleFieldChange(fieldIndex, { type: value as OrderFormFieldType })
                        }
                        options={ORDER_FORM_FIELD_TYPE_OPTIONS}
                        required
                      />
                    </div>

                    <div>
                      <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">
                        필드명
                      </Label>
                      <Input
                        placeholder="예: 사이즈 선택"
                        value={field.label}
                        onChange={(e) => handleFieldChange(fieldIndex, { label: e.target.value })}
                        className={fieldErrors[fieldIndex] ? "border-destructive" : ""}
                      />
                      {fieldErrors[fieldIndex] && (
                        <p className="text-sm text-destructive mt-1">{fieldErrors[fieldIndex]}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          handleFieldChange(fieldIndex, { required: e.target.checked })
                        }
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">필수 항목</span>
                    </label>
                  </div>

                  {field.type === "textbox" && (
                    <div>
                      <Label>플레이스홀더</Label>
                      <Input
                        placeholder="예: 케이크 문구를 입력해주세요"
                        value={field.placeholder || ""}
                        onChange={(e) =>
                          handleFieldChange(fieldIndex, { placeholder: e.target.value })
                        }
                      />
                    </div>
                  )}

                  {field.type === "selectbox" && (
                    <>
                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={field.allowMultiple || false}
                            onChange={(e) =>
                              handleFieldChange(fieldIndex, { allowMultiple: e.target.checked })
                            }
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">중복선택허용</span>
                        </label>
                      </div>
                      <div>
                        <div className="border-t my-2" />
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-medium">옵션</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddOption(fieldIndex)}
                          >
                            <span className="mr-2">+</span>
                            옵션 추가
                          </Button>
                        </div>
                      </div>

                      {field.options && field.options.length > 0 && (
                        <div>
                          <div className="flex flex-col gap-2">
                            {field.options.map((option, optionIndex) => (
                              <Card key={optionIndex}>
                                <div className="p-2">
                                  <div className="flex justify-between items-start">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 flex-1">
                                      <div className="md:col-span-6">
                                        <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">
                                          옵션명
                                        </Label>
                                        <Input
                                          placeholder="예: 1호"
                                          value={option.label}
                                          onChange={(e) =>
                                            handleOptionChange(fieldIndex, optionIndex, {
                                              label: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                      <div className="md:col-span-5">
                                        <Label>추가 가격</Label>
                                        <Input
                                          type="number"
                                          value={option.price ?? ""}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            handleOptionChange(fieldIndex, optionIndex, {
                                              price: value === "" ? undefined : parseInt(value) || 0,
                                            });
                                          }}
                                          min={0}
                                        />
                                      </div>
                                    </div>
                                    <button
                                      className="text-destructive hover:text-destructive/80 p-1 ml-1"
                                      onClick={() => handleRemoveOption(fieldIndex, optionIndex)}
                                      aria-label="옵션 삭제"
                                    >
                                      <span className="text-xl">×</span>
                                    </button>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
