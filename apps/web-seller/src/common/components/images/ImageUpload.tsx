import React, { useState, useRef } from "react";
import { Box, Button, Typography, CircularProgress, Alert, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { useUploadFile } from "@/apps/web-seller/features/upload/hooks/queries/useUpload";
import { UPLOAD_CONSTANTS } from "@/apps/web-seller/features/upload/constants/upload.constant";
import { ImagePreview } from "@/apps/web-seller/common/components/images/ImagePreview";

export interface ImageUploadProps {
  value?: string; // 업로드된 이미지 URL
  onChange?: (url: string) => void; // 이미지 URL 변경 핸들러
  error?: string; // 에러 메시지
  label?: string; // 라벨 텍스트
  required?: boolean; // 필수 여부
  accept?: string; // 허용된 이미지 확장자
  maxSize?: number; // 최대 파일 크기 (bytes)
  width?: number | string; // 컨테이너 너비
  height?: number | string; // 컨테이너 높이
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  error,
  label = "이미지 업로드",
  required = false,
  accept = UPLOAD_CONSTANTS.ALLOWED_EXTENSIONS.join(","),
  maxSize = UPLOAD_CONSTANTS.MAX_FILE_SIZE, // 10MB
  width = "100%",
  height = "100%",
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [uploadError, setUploadError] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadFile();

  // 공통 파일 처리 핸들러
  const processFile = async (file: File) => {
    if (!file) return;
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      setUploadError(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setUploadError("");
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
    try {
      const response = await uploadMutation.mutateAsync(file);
      onChange?.(response.fileUrl);
    } catch (error) {
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  // 이미지 삭제 핸들러
  const handleDelete = () => {
    setPreviewUrl(null);
    onChange?.("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploadError("");
  };

  // 파일 선택 버튼 클릭 핸들러
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const displayError = error || uploadError;
  const isUploading = uploadMutation.isPending;

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

      <Box
        sx={{
          position: "relative",
          width: width,
          maxWidth: "100%",
          height: height,
          boxSizing: "border-box",
          borderRadius: 1,
          overflow: "hidden",
          mb: 2,
          border: "1px solid",
          borderStyle: previewUrl ? "solid" : "dashed",
          borderColor: isDragging ? "primary.main" : displayError ? "error.main" : "divider",
          backgroundColor: isDragging ? "grey.100" : previewUrl ? "grey.100" : "grey.50",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: !previewUrl && !isUploading ? "pointer" : isUploading ? "not-allowed" : "default",
          opacity: isUploading ? 0.6 : 1,
          "&:hover": !previewUrl
            ? {
                borderColor: displayError ? "error.main" : "primary.main",
                backgroundColor: "grey.100",
              }
            : undefined,
        }}
        onClick={!previewUrl && !isUploading ? handleButtonClick : undefined}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <ImagePreview src={previewUrl} />
        ) : isUploading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">
              업로드 중...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              이미지를 클릭하거나 드래그하여 업로드
            </Typography>
            <Button variant="outlined" startIcon={<ImageIcon />}>
              파일 선택
            </Button>
          </Box>
        )}

        {isUploading && previewUrl && (
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

        {previewUrl && (
          <IconButton
            onClick={handleDelete}
            disabled={isUploading}
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
        )}
      </Box>

      {displayError && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {displayError}
        </Alert>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
        최대 파일 크기: {maxSize / (1024 * 1024)}MB
      </Typography>
    </Box>
  );
};
