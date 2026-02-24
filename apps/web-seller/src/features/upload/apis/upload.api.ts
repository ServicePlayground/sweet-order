import { userClient } from "@/apps/web-seller/common/config/axios.config";
import type { UploadFileResponseDto } from "@/apps/web-seller/features/upload/types/upload.dto";

export const uploadApi = {
  // 파일 업로드
  uploadFile: async (file: File): Promise<UploadFileResponseDto> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await userClient.post("/uploads/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },
};
