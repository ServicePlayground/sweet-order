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
import { OrderFormSchema, OrderFormField, OrderFormFieldType, OrderFormOption } from "@/apps/web-seller/features/product/types/product.type";
import { FormSelect } from "@/apps/web-seller/common/components/forms/FormSelect";
import { ORDER_FORM_FIELD_TYPE_OPTIONS, PRODUCT_ERROR_MESSAGES } from "@/apps/web-seller/features/product/constants/product.constant";

export interface OrderFormSchemaBuilderProps {
  value?: OrderFormSchema;
  onChange?: (schema: OrderFormSchema) => void;
  error?: string;
}

export const OrderFormSchemaBuilder: React.FC<OrderFormSchemaBuilderProps> = ({ value, onChange, error }) => {
  const [fields, setFields] = useState<OrderFormField[]>(value?.fields || []);
  const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({});

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
    if (!field.options) {
      field.options = [];
    }
    const newOption: OrderFormOption = {
      value: "",
      label: "",
      price: 0,
    };
    const newOptions = [...field.options, newOption];
    handleFieldChange(fieldIndex, { options: newOptions });
  };

  const handleRemoveOption = (fieldIndex: number, optionIndex: number) => {
    const field = fields[fieldIndex];
    if (!field.options) return;
    const newOptions = field.options.filter((_, i) => i !== optionIndex);
    handleFieldChange(fieldIndex, { options: newOptions });
  };

  const handleOptionChange = (fieldIndex: number, optionIndex: number, updates: Partial<OrderFormOption>) => {
    const field = fields[fieldIndex];
    if (!field.options) return;
    const newOptions = [...field.options];
    newOptions[optionIndex] = { ...newOptions[optionIndex], ...updates };
    handleFieldChange(fieldIndex, { options: newOptions });
  };

  const validateField = (field: OrderFormField, index: number): string | null => {
    if (!field.label.trim()) {
      return PRODUCT_ERROR_MESSAGES.ORDER_FORM_FIELD_LABEL_REQUIRED;
    }

    if (field.type === "selectbox" || field.type === "checkbox") {
      if (!field.options || field.options.length === 0) {
        return PRODUCT_ERROR_MESSAGES.ORDER_FORM_FIELD_OPTIONS_REQUIRED;
      }

      for (const option of field.options) {
        if (!option.label.trim()) {
          return PRODUCT_ERROR_MESSAGES.ORDER_FORM_FIELD_OPTION_LABEL_REQUIRED;
        }
        if (!option.value.trim()) {
          return PRODUCT_ERROR_MESSAGES.ORDER_FORM_FIELD_OPTION_VALUE_REQUIRED;
        }
      }
    }

    return null;
  };

  const validateAll = (): boolean => {
    const errors: Record<number, string> = {};
    fields.forEach((field, index) => {
      const error = validateField(field, index);
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
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
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
                    <FormSelect
                      label="필드 타입"
                      value={field.type}
                      onChange={(value) => handleFieldChange(fieldIndex, { type: value as OrderFormFieldType })}
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
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.required}
                          onChange={(e) => handleFieldChange(fieldIndex, { required: e.target.checked })}
                        />
                      }
                      label="필수 항목"
                    />
                  </Grid>

                  {(field.type === "textbox" || field.type === "textarea") && (
                    <Grid item xs={12}>
                      <TextField
                        label="플레이스홀더"
                        fullWidth
                        value={field.placeholder || ""}
                        onChange={(e) => handleFieldChange(fieldIndex, { placeholder: e.target.value })}
                        placeholder="예: 케이크 문구를 입력해주세요"
                      />
                    </Grid>
                  )}

                  {(field.type === "selectbox" || field.type === "checkbox") && (
                    <>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
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
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                  <Grid container spacing={2} sx={{ flex: 1 }}>
                                    <Grid item xs={12} md={4}>
                                      <TextField
                                        label="옵션값"
                                        fullWidth
                                        size="small"
                                        value={option.value}
                                        onChange={(e) =>
                                          handleOptionChange(fieldIndex, optionIndex, { value: e.target.value })
                                        }
                                        placeholder="예: 1호"
                                        required
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                      <TextField
                                        label="옵션명"
                                        fullWidth
                                        size="small"
                                        value={option.label}
                                        onChange={(e) =>
                                          handleOptionChange(fieldIndex, optionIndex, { label: e.target.value })
                                        }
                                        placeholder="예: 1호"
                                        required
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                      <TextField
                                        label="추가 가격"
                                        fullWidth
                                        size="small"
                                        type="number"
                                        value={option.price || 0}
                                        onChange={(e) =>
                                          handleOptionChange(fieldIndex, optionIndex, {
                                            price: parseInt(e.target.value) || 0,
                                          })
                                        }
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

