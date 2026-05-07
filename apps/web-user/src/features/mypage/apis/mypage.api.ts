import { consumerClient } from "@/apps/web-user/common/config/axios.config";
import type { MypageProfile } from "@/apps/web-user/features/mypage/types/profile.type";

export interface UpdateMypageProfileBody {
  name?: string;
  nickname?: string;
  profileImageUrl?: string | null;
}

export const mypageApi = {
  getProfile: async (): Promise<MypageProfile> => {
    const response = await consumerClient.get("/mypage/profile");
    return response.data.data;
  },
  updateProfile: async (body: UpdateMypageProfileBody): Promise<MypageProfile> => {
    const response = await consumerClient.patch("/mypage/profile", body);
    return response.data.data;
  },
};
