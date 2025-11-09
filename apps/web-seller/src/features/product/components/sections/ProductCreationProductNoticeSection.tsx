import React from "react";
import { Grid, TextField, Typography, Box } from "@mui/material";
import { IProductForm } from "@/apps/web-seller/features/product/types/product.type";

export interface ProductCreationProductNoticeSectionProps {
  form: IProductForm;
  errors: Partial<Record<keyof IProductForm, string>>;
  onChange: (
    key: keyof IProductForm,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// 상품 등록 폼 - 상품정보제공고시 섹션
export const ProductCreationProductNoticeSection: React.FC<
  ProductCreationProductNoticeSectionProps
> = ({ form, errors, onChange }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        상품정보제공고시
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        식품 판매 시 법적으로 입력해야 하는 항목들입니다. 모든 항목은 필수 입력입니다.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="식품의 유형"
            fullWidth
            value={form.productNoticeFoodType || ""}
            onChange={onChange("productNoticeFoodType")}
            error={Boolean(errors.productNoticeFoodType)}
            helperText={errors.productNoticeFoodType}
            required
            placeholder="예: 케이크류"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="제조사"
            fullWidth
            value={form.productNoticeProducer || ""}
            onChange={onChange("productNoticeProducer")}
            error={Boolean(errors.productNoticeProducer)}
            helperText={errors.productNoticeProducer}
            required
            placeholder="예: 스위트오더"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="원산지"
            fullWidth
            value={form.productNoticeOrigin || ""}
            onChange={onChange("productNoticeOrigin")}
            error={Boolean(errors.productNoticeOrigin)}
            helperText={errors.productNoticeOrigin}
            required
            placeholder="예: 국내산"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="소재지"
            fullWidth
            value={form.productNoticeAddress || ""}
            onChange={onChange("productNoticeAddress")}
            error={Boolean(errors.productNoticeAddress)}
            helperText={errors.productNoticeAddress}
            required
            placeholder="예: 서울시 강남구 테헤란로 123"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="제조연월일"
            fullWidth
            value={form.productNoticeManufactureDate || ""}
            onChange={onChange("productNoticeManufactureDate")}
            error={Boolean(errors.productNoticeManufactureDate)}
            helperText={errors.productNoticeManufactureDate}
            required
            placeholder="예: 2024-01-01"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="소비기한 또는 품질유지기한"
            fullWidth
            value={form.productNoticeExpirationDate || ""}
            onChange={onChange("productNoticeExpirationDate")}
            error={Boolean(errors.productNoticeExpirationDate)}
            helperText={errors.productNoticeExpirationDate}
            required
            placeholder="예: 제조일로부터 3일"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="포장단위별 용량/수량"
            fullWidth
            value={form.productNoticePackageCapacity || ""}
            onChange={onChange("productNoticePackageCapacity")}
            error={Boolean(errors.productNoticePackageCapacity)}
            helperText={errors.productNoticePackageCapacity}
            required
            placeholder="예: 500g"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="포장 단위별 수량"
            fullWidth
            value={form.productNoticePackageQuantity || ""}
            onChange={onChange("productNoticePackageQuantity")}
            error={Boolean(errors.productNoticePackageQuantity)}
            helperText={errors.productNoticePackageQuantity}
            required
            placeholder="예: 1개"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="원재료명 및 함량"
            fullWidth
            multiline
            rows={3}
            value={form.productNoticeIngredients || ""}
            onChange={onChange("productNoticeIngredients")}
            error={Boolean(errors.productNoticeIngredients)}
            helperText={errors.productNoticeIngredients}
            required
            placeholder="예: 초콜릿, 밀가루, 설탕, 우유, 계란"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="영양성분"
            fullWidth
            multiline
            rows={3}
            value={form.productNoticeCalories || ""}
            onChange={onChange("productNoticeCalories")}
            error={Boolean(errors.productNoticeCalories)}
            helperText={errors.productNoticeCalories}
            required
            placeholder="예: 칼로리: 350kcal, 탄수화물: 45g, 단백질: 5g, 지방: 15g"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="소비자안전을 위한 주의사항"
            fullWidth
            multiline
            rows={3}
            value={form.productNoticeSafetyNotice || ""}
            onChange={onChange("productNoticeSafetyNotice")}
            error={Boolean(errors.productNoticeSafetyNotice)}
            helperText={errors.productNoticeSafetyNotice}
            required
            placeholder="예: 알레르기 주의: 우유, 계란, 밀 함유"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="유전자변형식품에 해당하는 경우의 표시"
            fullWidth
            value={form.productNoticeGmoNotice || ""}
            onChange={onChange("productNoticeGmoNotice")}
            error={Boolean(errors.productNoticeGmoNotice)}
            helperText={errors.productNoticeGmoNotice}
            required
            placeholder="예: 해당사항 없음"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="수입식품의 경우"
            fullWidth
            value={form.productNoticeImportNotice || ""}
            onChange={onChange("productNoticeImportNotice")}
            error={Boolean(errors.productNoticeImportNotice)}
            helperText={errors.productNoticeImportNotice}
            required
            placeholder="예: 해당사항 없음"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="고객센터"
            fullWidth
            value={form.productNoticeCustomerService || ""}
            onChange={onChange("productNoticeCustomerService")}
            error={Boolean(errors.productNoticeCustomerService)}
            helperText={errors.productNoticeCustomerService}
            required
            placeholder="예: 1588-1234"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
