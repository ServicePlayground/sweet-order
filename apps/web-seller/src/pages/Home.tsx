import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box sx={{ color, mr: 1 }}>{icon}</Box>
        <Typography color="textSecondary" gutterBottom variant="body2">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export const HomePage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        대시보드
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 매출"
            value="₩2,450,000"
            icon={<AttachMoneyIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="총 주문" value="156" icon={<ShoppingCartIcon />} color="success.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="상품 수" value="24" icon={<InventoryIcon />} color="info.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="성장률" value="+12.5%" icon={<TrendingUpIcon />} color="warning.main" />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              최근 주문 현황
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}
            >
              <Typography color="textSecondary">차트 영역 (추후 구현)</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              빠른 작업
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              <Button variant="contained" fullWidth>
                새 상품 등록
              </Button>
              <Button variant="outlined" fullWidth>
                주문 확인
              </Button>
              <Button variant="outlined" fullWidth>
                재고 관리
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
