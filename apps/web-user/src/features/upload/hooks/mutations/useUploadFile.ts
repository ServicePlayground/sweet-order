import { useMutation } from "@tanstack/react-query";
import { uploadApi } from "@/apps/web-user/features/upload/apis/upload.api";
import { UploadFileResponse } from "@/apps/web-user/features/upload/types/upload.type";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";

/**
 * 파일 업로드 뮤테이션
 */
export function useUploadFile() {
  const { showAlert } = useAlertStore();

  return useMutation<UploadFileResponse, Error, File>({
    mutationFn: (file: File) => uploadApi.uploadFile(file),
    onError: (error) => {
      showAlert({
        type: "error",
        title: "이미지 업로드 실패",
        message: getApiMessage.error(error),
      });
    },
  });
}
