"use client";

import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Stack, Paper } from "@mui/material";

interface LoadingFallbackProps {
  variant?: "overlay" | "corner";
  message?: string;
}

export function LoadingFallback({
  variant = "overlay",
  message = "로딩 중...",
}: LoadingFallbackProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (variant === "corner") {
    return (
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          p: 1.5,
          borderRadius: 2,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CircularProgress size={16} color="inherit" />
        <Typography variant="body2" fontWeight={500}>
          {message}
          {dots}
        </Typography>
      </Paper>
    );
  }

  // overlay variant (기본값)
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <Stack spacing={2} alignItems="center">
        <CircularProgress size={48} />
        <Typography variant="body1" fontWeight={500} color="text.primary">
          {message}
          {dots}
        </Typography>
      </Stack>
    </Box>
  );
}
