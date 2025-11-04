import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { useUploadFile } from "@/apps/web-seller/features/upload/hooks/queries/useUpload";

export interface ImageUploadProps {
  /**
   * 업로드된 이미지 URL
   */
  value?: string;
  /**
   * 이미지 URL 변경 핸들러
   */
  onChange?: (url: string) => void;
  /**
   * 에러 메시지
   */
  error?: string;
  /**
   * 라벨 텍스트
   */
  label?: string;
  /**
   * 필수 여부
   */
  required?: boolean;
  /**
   * 허용된 이미지 타입 (MIME 타입)
   * 기본값: image/jpeg, image/png, image/gif, image/webp
   */
  accept?: string;
  /**
   * 최대 파일 크기 (bytes)
   * 기본값: 10MB
   */
  maxSize?: number;
  /**
   * 미리보기 이미지 비율 (aspect ratio)
   */
  aspectRatio?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  error,
  label = "이미지 업로드",
  required = false,
  accept = "image/jpeg,image/png,image/gif,image/webp",
  maxSize = 10 * 1024 * 1024, // 10MB
  aspectRatio,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadFile();

  // 파일 선택 핸들러
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 검증
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      setUploadError(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // 파일 타입 검증
    if (!accept.split(",").some((type) => file.type.includes(type.trim()))) {
      setUploadError("지원하지 않는 이미지 형식입니다.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setUploadError("");

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 파일 업로드
    try {
      const response = await uploadMutation.mutateAsync(file);
      onChange?.(response.fileUrl);
    } catch (error) {
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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

      {previewUrl ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 400,
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              aspectRatio: aspectRatio || "16/9",
              borderRadius: 1,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "grey.100",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <img
              src={previewUrl}
              alt="미리보기"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {isUploading && (
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
          </Box>
          <IconButton
            onClick={handleDelete}
            disabled={isUploading}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "white",
              "&:hover": {
                backgroundColor: "grey.200",
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ) : (
        <Box
          sx={{
            border: "2px dashed",
            borderColor: displayError ? "error.main" : "divider",
            borderRadius: 1,
            p: 3,
            textAlign: "center",
            backgroundColor: "grey.50",
            cursor: isUploading ? "not-allowed" : "pointer",
            opacity: isUploading ? 0.6 : 1,
            "&:hover": {
              borderColor: displayError ? "error.main" : "primary.main",
              backgroundColor: "grey.100",
            },
          }}
          onClick={isUploading ? undefined : handleButtonClick}
        >
          {isUploading ? (
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
        </Box>
      )}

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

