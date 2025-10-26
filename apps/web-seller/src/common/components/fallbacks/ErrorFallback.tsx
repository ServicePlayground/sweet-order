"use client";

import { FallbackProps } from "react-error-boundary";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Alert,
  AlertTitle,
} from "@mui/material";
import { ErrorOutline, Refresh, Replay } from "@mui/icons-material";

interface ErrorFallbackProps extends FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const handleRetry = () => {
    resetErrorBoundary();
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3} alignItems="center">
            <ErrorOutline
              sx={{
                fontSize: 48,
                color: "error.main",
              }}
            />

            <Typography variant="h5" component="h2" color="error" fontWeight={600}>
              예상치 못한 오류가 발생했습니다
            </Typography>

            <Alert severity="error" sx={{ width: "100%" }}>
              <AlertTitle>오류 상세</AlertTitle>
              {error.message || "알 수 없는 오류가 발생했습니다."}
            </Alert>

            <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
              <Button
                variant="contained"
                startIcon={<Replay />}
                onClick={handleRetry}
                fullWidth
                sx={{ flex: 1 }}
              >
                다시 시도
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleReload}
                fullWidth
                sx={{ flex: 1 }}
              >
                페이지 새로고침
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
