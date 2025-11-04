import { useMutation } from "@tanstack/react-query";
import { uploadApi } from "@/apps/web-seller/features/upload/apis/upload.api";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";

// 파일 업로드 뮤테이션
export function useUploadFile() {
  const { addAlert } = useAlertStore();

  return useMutation({
    mutationFn: (file: File) => uploadApi.uploadFile(file),
    onError: (error) => {
      addAlert({
        severity: "error",
        message: getApiMessage.error(error),
      });
    },
  });
}

