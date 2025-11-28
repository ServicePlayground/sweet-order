import React, { useState, useRef } from "react";
import { Button } from "@/apps/web-seller/common/components/ui/button";
import { Label } from "@/apps/web-seller/common/components/ui/label";
import { Alert, AlertDescription } from "@/apps/web-seller/common/components/ui/alert";
import { CloudUpload, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/apps/web-seller/lib/utils";
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
    <div className="w-full">
      {label && (
        <Label className={cn("mb-1 block", required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {value.map((url, index) => (
          <div key={index} className="relative w-full aspect-square">
            <div
              className={cn(
                "relative w-full h-full rounded-md overflow-hidden border bg-muted",
                uploadErrors[index] && "border-destructive"
              )}
            >
              <ImagePreview src={url} />
              {uploadingIndex === index && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-10 w-10 animate-spin text-white" />
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(index)}
                disabled={uploadingIndex === index}
                className="absolute top-2 right-2 bg-white hover:bg-gray-200"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {uploadErrors[index] && (
                <div className="absolute bottom-0 left-0 right-0 bg-destructive text-destructive-foreground p-1 text-xs">
                  {uploadErrors[index]}
                </div>
              )}
            </div>
          </div>
        ))}

        {canAddMore && (
          <div className="relative w-full aspect-square">
            <div
              className={cn(
                "relative w-full h-full box-border rounded-md overflow-hidden border border-dashed bg-muted/50 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-muted transition-colors",
                displayError && "border-destructive hover:border-destructive"
              )}
              onClick={handleButtonClick}
            >
              <div className="flex flex-col items-center gap-1">
                <CloudUpload className="h-8 w-8 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">이미지 추가</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      <p className="text-xs text-muted-foreground mt-1">
        최대 파일 크기: {maxSize / (1024 * 1024)}MB, 최대 이미지 개수: {maxImages}개
      </p>
    </div>
  );
};
