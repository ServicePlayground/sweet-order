import { userClient } from "@/apps/web-user/common/config/axios.config";
import { UploadFileResponse } from "@/apps/web-user/features/upload/types/upload.type";

export const uploadApi = {
  // 파일 업로드 (단일 파일)
  uploadFile: async (file: File): Promise<UploadFileResponse> => {
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

