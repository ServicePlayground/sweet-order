import React from "react";
import { Box, Typography, Alert } from "@mui/material";
import { RichTextEditor } from "@/apps/web-seller/common/components/editors/RichTextEditor";
import { IProductForm } from "@/apps/web-seller/features/product/types/product.type";

export interface ProductCreationDetailDescriptionSectionProps {
  form: IProductForm;
  errors: Partial<Record<keyof IProductForm, string>>;
  onChange: (value: string) => void;
}

// 상품 등록 폼 - 상세정보 섹션
export const ProductCreationDetailDescriptionSection: React.FC<
  ProductCreationDetailDescriptionSectionProps
> = ({ form, errors, onChange }) => {
  const placeholder =
    "상품의 상세 정보를 입력해주세요. 이미지, 텍스트, 링크 등을 활용하여 자세히 설명해주세요.";

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        상품 상세정보
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        상세정보는 필수 입력 항목입니다. 고객이 상품을 구매하기 전에 확인할 수 있는 상세한 정보를
        입력해주세요.
      </Typography>

      {errors.detailDescription && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.detailDescription}
        </Alert>
      )}

      <RichTextEditor
        value={form.detailDescription || ""}
        onChange={onChange}
        placeholder={placeholder}
        minHeight={400}
        error={!!errors.detailDescription}
      />
    </Box>
  );
};
