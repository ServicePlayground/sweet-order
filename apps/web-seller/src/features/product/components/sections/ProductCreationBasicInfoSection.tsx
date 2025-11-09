import React from "react";
import { Grid, TextField } from "@mui/material";
import { IProductForm, MainCategory } from "@/apps/web-seller/features/product/types/product.type";
import {
  PRODUCT_ERROR_MESSAGES,
  MAIN_CATEGORY_OPTIONS,
} from "@/apps/web-seller/features/product/constants/product.constant";
import { MultipleImageUpload } from "@/apps/web-seller/common/components/images/MultipleImageUpload";
import { SelectBox } from "@/apps/web-seller/common/components/selectboxs/SelectBox";

export interface ProductCreationBasicInfoSectionProps {
  form: IProductForm;
  errors: Partial<Record<keyof IProductForm, string>>;
  onCategoryChange: (value: MainCategory | "") => void;
  onImageUrlsChange: (urls: string[]) => void;
  onChange: (
    key: keyof IProductForm,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// 상품 등록 폼 - 기본 정보 섹션
export const ProductCreationBasicInfoSection: React.FC<ProductCreationBasicInfoSectionProps> = ({
  form,
  errors,
  onCategoryChange,
  onImageUrlsChange,
  onChange,
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <SelectBox
          label="카테고리"
          value={form.mainCategory}
          onChange={(value) => onCategoryChange(value as MainCategory | "")}
          options={MAIN_CATEGORY_OPTIONS}
          error={errors.mainCategory}
          required
        />
      </Grid>

      <Grid item xs={12} md={12}>
        <MultipleImageUpload
          label="상품 대표 이미지"
          value={form.imageUrls}
          onChange={onImageUrlsChange}
          error={errors.imageUrls}
          required
        />
      </Grid>

      <Grid item xs={12} md={12}>
        <TextField
          label="상품명"
          fullWidth
          value={form.name}
          onChange={onChange("name")}
          error={Boolean(errors.name)}
          helperText={errors.name}
          required
        />
      </Grid>

      <Grid item xs={12} md={12}>
        <TextField
          label="설명"
          fullWidth
          multiline
          rows={4}
          value={form.description || ""}
          onChange={onChange("description")}
          error={Boolean(errors.description)}
          helperText={errors.description}
          placeholder="상품에 대한 설명을 입력해주세요"
        />
      </Grid>

      <Grid item xs={12} md={12}>
        <TextField
          label="정가"
          fullWidth
          type="number"
          value={form.originalPrice === "" ? "" : form.originalPrice}
          onChange={onChange("originalPrice")}
          error={Boolean(errors.originalPrice)}
          helperText={errors.originalPrice}
          required
          inputProps={{ min: 0 }}
        />
      </Grid>

      <Grid item xs={12} md={12}>
        <TextField
          label="판매가"
          fullWidth
          type="number"
          value={form.salePrice === "" ? "" : form.salePrice}
          onChange={onChange("salePrice")}
          error={Boolean(errors.salePrice)}
          helperText={errors.salePrice}
          required
          inputProps={{ min: 0 }}
        />
      </Grid>

      <Grid item xs={12} md={12}>
        <TextField
          label="대표 안내 사항"
          fullWidth
          multiline
          rows={2}
          value={form.notice || ""}
          onChange={onChange("notice")}
          error={Boolean(errors.notice)}
          helperText={errors.notice}
          placeholder="예: 주문 후 1-2일 내 제작 완료"
        />
      </Grid>

      <Grid item xs={12} md={12}>
        <TextField
          label="대표 주의사항"
          fullWidth
          multiline
          rows={2}
          value={form.caution || ""}
          onChange={onChange("caution")}
          error={Boolean(errors.caution)}
          helperText={errors.caution}
          placeholder="예: 냉장 보관 필수, 3일 이내 섭취 권장"
        />
      </Grid>

      <Grid item xs={12} md={12}>
        <TextField
          label="기본 제공"
          fullWidth
          value={form.basicIncluded || ""}
          onChange={onChange("basicIncluded")}
          error={Boolean(errors.basicIncluded)}
          helperText={errors.basicIncluded || "공백이면 상품페이지에서 보이지 않습니다"}
          placeholder="예: 케이크, 촛불, 포크"
        />
      </Grid>
    </Grid>
  );
};
