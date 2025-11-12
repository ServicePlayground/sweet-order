import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
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
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">커스텀 주문양식</Typography>
        <Button startIcon={<AddIcon />} variant="outlined" onClick={handleAddField} size="small">
          필드 추가
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {fields.length === 0 ? (
        <Alert severity="info">주문양식 필드를 추가해주세요.</Alert>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {fields.map((field, fieldIndex) => (
            <Card key={field.id} variant="outlined">
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    필드 {fieldIndex + 1}
                  </Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveField(fieldIndex)}
                    aria-label="필드 삭제"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <SelectBox
                      label="필드 타입"
                      value={field.type}
                      onChange={(value) =>
                        handleFieldChange(fieldIndex, { type: value as OrderFormFieldType })
                      }
                      options={ORDER_FORM_FIELD_TYPE_OPTIONS}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="필드명"
                      fullWidth
                      value={field.label}
                      onChange={(e) => handleFieldChange(fieldIndex, { label: e.target.value })}
                      required
                      error={Boolean(fieldErrors[fieldIndex])}
                      helperText={fieldErrors[fieldIndex]}
                      placeholder="예: 사이즈 선택"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.required}
                          onChange={(e) =>
                            handleFieldChange(fieldIndex, { required: e.target.checked })
                          }
                        />
                      }
                      label="필수 항목"
                    />
                  </Grid>

                  {field.type === "textbox" && (
                    <Grid item xs={12}>
                      <TextField
                        label="플레이스홀더"
                        fullWidth
                        value={field.placeholder || ""}
                        onChange={(e) =>
                          handleFieldChange(fieldIndex, { placeholder: e.target.value })
                        }
                        placeholder="예: 케이크 문구를 입력해주세요"
                      />
                    </Grid>
                  )}

                  {field.type === "selectbox" && (
                    <>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.allowMultiple || false}
                              onChange={(e) =>
                                handleFieldChange(fieldIndex, { allowMultiple: e.target.checked })
                              }
                            />
                          }
                          label="중복선택허용"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle2">옵션</Typography>
                          <Button
                            startIcon={<AddIcon />}
                            variant="outlined"
                            size="small"
                            onClick={() => handleAddOption(fieldIndex)}
                          >
                            옵션 추가
                          </Button>
                        </Box>
                      </Grid>

                      {field.options && field.options.length > 0 && (
                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {field.options.map((option, optionIndex) => (
                              <Card key={optionIndex} variant="outlined" sx={{ p: 2 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <Grid container spacing={2} sx={{ flex: 1 }}>
                                    <Grid item xs={12} md={6}>
                                      <TextField
                                        label="옵션명"
                                        fullWidth
                                        size="small"
                                        value={option.label}
                                        onChange={(e) =>
                                          handleOptionChange(fieldIndex, optionIndex, {
                                            label: e.target.value,
                                          })
                                        }
                                        placeholder="예: 1호"
                                        required
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                      <TextField
                                        label="추가 가격"
                                        fullWidth
                                        size="small"
                                        type="number"
                                        value={option.price ?? ""}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          handleOptionChange(fieldIndex, optionIndex, {
                                            price: value === "" ? undefined : parseInt(value) || 0,
                                          });
                                        }}
                                        inputProps={{ min: 0 }}
                                      />
                                    </Grid>
                                  </Grid>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleRemoveOption(fieldIndex, optionIndex)}
                                    sx={{ ml: 1 }}
                                    aria-label="옵션 삭제"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              </Card>
                            ))}
                          </Box>
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};
