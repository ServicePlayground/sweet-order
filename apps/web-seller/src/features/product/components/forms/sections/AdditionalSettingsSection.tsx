import React from "react";
import { Grid, TextField, Typography, Divider, Paper } from "@mui/material";
import { IProductForm, SizeRange, DeliveryMethod, ProductStatus } from "@/apps/web-seller/features/product/types/product.type";
import {
  SIZE_RANGE_OPTIONS,
  DELIVERY_METHOD_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
} from "@/apps/web-seller/features/product/constants/product.constant";
import { FormSelect } from "@/apps/web-seller/common/components/forms/FormSelect";
import { FormMultiSelect } from "@/apps/web-seller/common/components/forms/FormMultiSelect";
import { HashtagInput } from "@/apps/web-seller/common/components/forms/HashtagInput";

interface Props {
  form: IProductForm;
  errors: Partial<Record<keyof IProductForm, string>>;
  onStockChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onStatusChange: (value: ProductStatus) => void;
  onSizeRangeChange: (values: string[]) => void;
  onDeliveryMethodChange: (values: string[]) => void;
  onHashtagsChange: (hashtags: string[]) => void;
}

export const AdditionalSettingsSection: React.FC<Props> = ({
  form,
  errors,
  onStockChange,
  onStatusChange,
  onSizeRangeChange,
  onDeliveryMethodChange,
  onHashtagsChange,
}) => {
  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        추가 설정
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="재고수량"
            fullWidth
            type="number"
            value={form.stock === "" ? "" : form.stock}
            onChange={onStockChange}
            error={Boolean(errors.stock)}
            helperText={errors.stock || "1개 이상 필수"}
            required
            inputProps={{ min: 1 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormSelect
            label="상품 상태"
            value={form.status}
            onChange={(value) => onStatusChange(value as ProductStatus)}
            options={PRODUCT_STATUS_OPTIONS}
            error={errors.status}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormMultiSelect
            label="인원 수"
            value={form.sizeRange}
            onChange={onSizeRangeChange}
            options={SIZE_RANGE_OPTIONS}
            error={errors.sizeRange}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormMultiSelect
            label="배송 방법"
            value={form.deliveryMethod}
            onChange={onDeliveryMethodChange}
            options={DELIVERY_METHOD_OPTIONS}
            error={errors.deliveryMethod}
            required
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <HashtagInput
            label="해시태그"
            value={form.hashtags}
            onChange={onHashtagsChange}
            error={errors.hashtags}
            maxTags={10}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

