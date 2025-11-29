import React, { useState, useRef } from "react";
import { Button } from "@/apps/web-seller/common/components/@shadcn-ui/button";
import { Label } from "@/apps/web-seller/common/components/@shadcn-ui/label";
import { Alert, AlertDescription } from "@/apps/web-seller/common/components/@shadcn-ui/alert";
import { CloudUpload, Trash2, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/apps/web-seller/common/lib/utils";
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
    <div className="w-full">
      {label && (
        <Label
          className={cn(
            "mb-1 block",
            required && "after:content-['*'] after:ml-0.5 after:text-destructive",
          )}
        >
          {label}
        </Label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        className={cn(
          "relative box-border rounded-md overflow-hidden mb-2 border flex items-center justify-center transition-colors",
          previewUrl ? "border-solid bg-muted" : "border-dashed bg-muted/50",
          isDragging && "border-primary bg-muted",
          displayError && "border-destructive",
          !previewUrl && !isUploading && "cursor-pointer hover:border-primary hover:bg-muted",
          isUploading && "cursor-not-allowed opacity-60",
        )}
        style={{ width, maxWidth: "100%", height }}
        onClick={!previewUrl && !isUploading ? handleButtonClick : undefined}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <ImagePreview src={previewUrl} />
        ) : isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">업로드 중...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4">
            <CloudUpload className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              이미지를 클릭하거나 드래그하여 업로드
            </p>
            <Button variant="outline" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              파일 선택
            </Button>
          </div>
        )}

        {isUploading && previewUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-10 w-10 animate-spin text-white" />
          </div>
        )}

        {previewUrl && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isUploading}
            className="absolute top-2 right-2 bg-white hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {displayError && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      <p className="text-xs text-muted-foreground mt-1">
        최대 파일 크기: {maxSize / (1024 * 1024)}MB
      </p>
    </div>
  );
};
