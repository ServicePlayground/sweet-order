import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStoreStore } from "@/apps/web-seller/features/store/store/store.store";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";

export const RootPage: React.FC = () => {
  const navigate = useNavigate();
  const { stores } = useStoreStore();

  useEffect(() => {
    if (stores.length > 0) {
      navigate(ROUTES.STORE_DETAIL_HOME(stores[0].id), { replace: true });
    }
  }, [stores, navigate]);

  if (stores.length === 0) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          스토어가 없습니다
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          먼저 스토어를 생성해주세요.
        </Typography>
        <Button variant="contained" onClick={() => navigate(ROUTES.STORE_CREATE)}>
          스토어 만들기
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography color="textSecondary">스토어로 이동 중...</Typography>
    </Box>
  );
};
