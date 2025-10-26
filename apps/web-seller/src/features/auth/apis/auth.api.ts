import { UserInfo } from "@/apps/web-seller/features/auth/types/auth.type";
import { authClient } from "@/apps/web-seller/common/config/axios.config";
import { MessageResponse } from "@/apps/web-seller/common/types/api.type";

export const authApi = {
  // 현재 사용자 정보 조회
  me: async (): Promise<{ user: UserInfo }> => {
    const response = await authClient.get("/auth/me");
    return response.data.data;
  },

  // 로그아웃
  logout: async (): Promise<MessageResponse> => {
    const response = await authClient.post("/auth/logout");
    return response.data.data;
  },
};
