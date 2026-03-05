import { userClient } from "@/apps/web-user/common/config/axios.config";
import { UserProfile } from "@/apps/web-user/features/user/types/user.type";

export const userApi = {
  getMe: async (): Promise<UserProfile> => {
    const response = await userClient.get("/auth/me");
    return response.data.data.user;
  },
};
