import { authClient } from "@/apps/web-seller/common/config/axios.config";

export interface IUploadFileResponse {
  fileUrl: string;
}

export const uploadApi = {
  // 파일 업로드
  uploadFile: async (file: File): Promise<IUploadFileResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await authClient.post("/uploads/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },
};

