import { consumerClient } from "@/apps/web-user/common/config/axios.config";
import type { MypageProfile } from "@/apps/web-user/features/mypage/types/profile.type";

export const mypageApi = {
  getProfile: async (): Promise<MypageProfile> => {
    const response = await consumerClient.get("/mypage/profile");
    return response.data.data;
  },
};
