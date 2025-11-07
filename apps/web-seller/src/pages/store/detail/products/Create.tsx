import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import { ProductCreationForm } from "@/apps/web-seller/features/product/components/forms/ProductCreationForm";
import { IProductForm } from "@/apps/web-seller/features/product/types/product.type";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";

export const StoreDetailProductCreatePage: React.FC = () => {
  const { storeId } = useParams();
  const { addAlert } = useAlertStore();

  if (!storeId) {
    return (
      <Box>
        <Typography variant="h6">스토어가 선택되지 않았습니다.</Typography>
      </Box>
    );
  }

  const handleSubmit = async (data: IProductForm) => {
    // TODO: 상품 등록 API 호출
    console.log("상품 등록 데이터:", data);
    addAlert({
      severity: "success",
      message: "상품이 등록되었습니다.",
    });
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
