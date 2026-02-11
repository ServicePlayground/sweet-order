import { userClient } from "@/apps/web-user/common/config/axios.config";
import {
  Feed,
  FeedListResponse,
  GetFeedsParams,
} from "@/apps/web-user/features/feed/types/feed.type";

export const feedApi = {
  // 스토어 피드 목록 조회
  getStoreFeeds: async ({
    storeId,
    page = 1,
    limit = 20,
  }: GetFeedsParams): Promise<FeedListResponse> => {
    const response = await userClient.get(`/store/${storeId}/feed`, {
      params: { page, limit },
    });
    return response.data.data;
  },

  // 스토어 피드 단일 조회
  getStoreFeed: async (storeId: string, feedId: string): Promise<Feed> => {
    const response = await userClient.get(`/store/${storeId}/feed/${feedId}`);
    return response.data.data;
  },
};
