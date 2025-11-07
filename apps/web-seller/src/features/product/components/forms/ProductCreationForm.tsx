import React, { useState, useEffect } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { IProductForm, MainCategory } from "@/apps/web-seller/features/product/types/product.type";
import { PRODUCT_ERROR_MESSAGES, MAIN_CATEGORY_OPTIONS } from "@/apps/web-seller/features/product/constants/product.constant";
import { MultipleImageUpload } from "@/apps/web-seller/common/components/images/MultipleImageUpload";
import { FormSelect } from "@/apps/web-seller/common/components/forms/FormSelect";

interface Props {
  onSubmit: (data: IProductForm) => void;
  initialValue?: IProductForm;
  onChange?: (data: IProductForm) => void;
}

export const defaultForm: IProductForm = {
  mainCategory: "",
  imageUrls: [],
  name: "",
};

export const ProductCreationForm: React.FC<Props> = ({
  onSubmit,
  initialValue,
  onChange,
}) => {
  const [form, setForm] = useState<IProductForm>(initialValue || defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof IProductForm, string>>>({});

  useEffect(() => {
    if (initialValue) {
      setForm(initialValue);
      setErrors({});
    }
  }, [initialValue]);

  const validate = () => {
    const newErrors: Partial<Record<keyof IProductForm, string>> = {};

    if (!form.mainCategory) {
      newErrors.mainCategory = PRODUCT_ERROR_MESSAGES.MAIN_CATEGORY_REQUIRED;
    }

    if (form.imageUrls.length === 0) {
      newErrors.imageUrls = PRODUCT_ERROR_MESSAGES.IMAGE_URLS_REQUIRED;
    }

    if (!form.name.trim()) {
      newErrors.name = PRODUCT_ERROR_MESSAGES.NAME_REQUIRED;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (key: keyof IProductForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = { ...form, [key]: e.target.value };
      setForm(next);
      onChange?.(next);
    };

  const handleCategoryChange = (value: MainCategory | "") => {
    const next = { ...form, mainCategory: value };
    setForm(next);
    onChange?.(next);
  };

  const handleImageUrlsChange = (urls: string[]) => {
    const next = { ...form, imageUrls: urls };
    setForm(next);
    onChange?.(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <FormSelect
            label="카테고리"
            value={form.mainCategory}
            onChange={(value) => handleCategoryChange(value as MainCategory | "")}
            options={MAIN_CATEGORY_OPTIONS}
            error={errors.mainCategory}
            required
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <MultipleImageUpload
            label="상품 대표 이미지"
            value={form.imageUrls}
            onChange={handleImageUrlsChange}
            error={errors.imageUrls}
            required
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <TextField
            label="상품명"
            fullWidth
            value={form.name}
            onChange={handleChange("name")}
            error={Boolean(errors.name)}
            helperText={errors.name}
            required
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" variant="contained">
          상품 등록
        </Button>
      </Box>
    </Box>
  );
};

