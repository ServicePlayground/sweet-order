import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";

export const StoreDetailProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();

  if (!storeId) {
    return (
      <Box>
        <Typography variant="h6">스토어가 선택되지 않았습니다.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        상품 목록
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate(ROUTES.STORE_DETAIL_PRODUCTS_CREATE(storeId))}
        sx={{ mb: 2 }}
      >
        상품 등록
      </Button>
      <Typography color="textSecondary">상품 목록은 추후 연동 예정</Typography>
    </Box>
  );
};
