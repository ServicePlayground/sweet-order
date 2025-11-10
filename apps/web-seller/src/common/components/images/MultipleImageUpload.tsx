import React, { useState, useRef } from "react";
import { Box, Typography, CircularProgress, Alert, IconButton, Grid } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUploadFile } from "@/apps/web-seller/features/upload/hooks/queries/useUpload";
import { UPLOAD_CONSTANTS } from "@/apps/web-seller/features/upload/constants/upload.constant";
import { ImagePreview } from "@/apps/web-seller/common/components/images/ImagePreview";

export interface MultipleImageUploadProps {
  value?: string[]; // 업로드된 이미지 URL 배열
  onChange?: (urls: string[]) => void; // 이미지 URL 배열 변경 핸들러
  error?: string; // 에러 메시지
  label?: string; // 라벨 텍스트
  required?: boolean; // 필수 여부
  accept?: string; // 허용된 이미지 확장자
  maxSize?: number; // 최대 파일 크기 (bytes)
  maxImages?: number; // 최대 이미지 개수
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  value = [],
  onChange,
  error,
  label = "이미지 업로드",
  required = false,
  accept = UPLOAD_CONSTANTS.ALLOWED_EXTENSIONS.join(","),
  maxSize = UPLOAD_CONSTANTS.MAX_FILE_SIZE, // 10MB
  maxImages = 10,
}) => {
  const [uploadErrors, setUploadErrors] = useState<Record<number, string>>({});
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadFile();

  // 공통 파일 처리 핸들러
  const processFile = async (file: File, index?: number) => {
    if (!file) return;

    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      const errorMsg = `파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`;
      if (index !== undefined) {
        setUploadErrors((prev) => ({ ...prev, [index]: errorMsg }));
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (value.length >= maxImages) {
      const errorMsg = `최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`;
      if (index !== undefined) {
        setUploadErrors((prev) => ({ ...prev, [index]: errorMsg }));
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (index !== undefined) {
      setUploadingIndex(index);
      setUploadErrors((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }

    try {
      const response = await uploadMutation.mutateAsync(file);
      const newUrls = [...value, response.fileUrl];
      onChange?.(newUrls);
    } catch (error) {
      if (index !== undefined) {
        setUploadErrors((prev) => ({
          ...prev,
          [index]: "이미지 업로드에 실패했습니다.",
        }));
      }
    } finally {
      if (index !== undefined) {
        setUploadingIndex(null);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // 첫 번째 파일만 처리 (1개씩만 선택)
    if (value.length >= maxImages) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    await processFile(files[0], value.length);
  };

  // 이미지 삭제 핸들러
  const handleDelete = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange?.(newUrls);
    setUploadErrors((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  // 파일 선택 버튼 클릭 핸들러
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const displayError = error;
  const canAddMore = value.length < maxImages;

  return (
    <Box>
      {label && (
        <Typography variant="body2" sx={{ mb: 1 }} component="label">
          {label}
          {required && <span style={{ color: "red" }}> *</span>}
        </Typography>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      <Grid container spacing={2}>
        {value.map((url, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "1",
                borderRadius: 1,
                overflow: "hidden",
                border: "1px solid",
                borderColor: uploadErrors[index] ? "error.main" : "divider",
                backgroundColor: "grey.100",
              }}
            >
              <ImagePreview src={url} />
              {uploadingIndex === index && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <CircularProgress size={40} sx={{ color: "white" }} />
                </Box>
              )}
              <IconButton
                onClick={() => handleDelete(index)}
                disabled={uploadingIndex === index}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "grey.200" },
                }}
              >
                <DeleteIcon />
              </IconButton>
              {uploadErrors[index] && (
                <Alert
                  severity="error"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    fontSize: "0.75rem",
                    py: 0.5,
                  }}
                >
                  {uploadErrors[index]}
                </Alert>
              )}
            </Box>
          </Grid>
        ))}

        {canAddMore && (
          <Grid item xs={6} sm={4} md={3}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "1",
                boxSizing: "border-box",
                borderRadius: 1,
                overflow: "hidden",
                border: "1px solid",
                borderStyle: "dashed",
                borderColor: displayError ? "error.main" : "divider",
                backgroundColor: "grey.50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": {
                  borderColor: displayError ? "error.main" : "primary.main",
                  backgroundColor: "grey.100",
                },
              }}
              onClick={handleButtonClick}
            >
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <CloudUploadIcon sx={{ fontSize: 32, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  이미지 추가
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>

      {displayError && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {displayError}
        </Alert>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
        최대 파일 크기: {maxSize / (1024 * 1024)}MB, 최대 이미지 개수: {maxImages}개
      </Typography>
    </Box>
  );
};
