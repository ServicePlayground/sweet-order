import React from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

export const StoreDetailProductCreatePage: React.FC = () => {
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
        상품 등록
      </Typography>
      <Typography color="textSecondary">상품 등록 폼은 추후 구현</Typography>
    </Box>
  );
};
