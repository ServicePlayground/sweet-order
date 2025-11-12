import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import { ProductCreationForm } from "@/apps/web-seller/features/product/components/forms/ProductCreationForm";
import {
  IProductForm,
  ICreateProductRequest,
} from "@/apps/web-seller/features/product/types/product.type";
import { useCreateProduct } from "@/apps/web-seller/features/product/hooks/queries/useProduct";

export const StoreDetailProductCreatePage: React.FC = () => {
  const { storeId } = useParams();
  const createProductMutation = useCreateProduct();

  if (!storeId) {
    return (
      <Box>
        <Typography variant="h6">스토어가 선택되지 않았습니다.</Typography>
      </Box>
    );
  }

  const handleSubmit = async (data: IProductForm) => {
    // IProductForm을 ICreateProductRequest로 변환
    const request: ICreateProductRequest = {
      ...data,
      storeId,
    };

    await createProductMutation.mutateAsync(request);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        상품 등록
      </Typography>
      <Paper sx={{ p: 3 }}>
        <ProductCreationForm onSubmit={handleSubmit} />
      </Paper>
    </Box>
  );
};
