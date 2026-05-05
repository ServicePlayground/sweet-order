import { consumerClient } from "@/apps/web-user/common/config/axios.config";
import type { FcmToken } from "@/apps/web-user/features/fcm/types/fcm.type";

export const fcmApi = {
  syncConsumerFcmToken: async (requestDto: FcmToken): Promise<void> => {
    await consumerClient.post("/fcm-tokens", requestDto);
  },
};
