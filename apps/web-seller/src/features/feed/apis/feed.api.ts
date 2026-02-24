import { sellerClient } from "@/apps/web-seller/common/config/axios.config";
import {
  CreateFeedRequestDto,
  UpdateFeedRequestDto,
  FeedListRequestDto,
  FeedResponseDto,
  FeedListResponseDto,
  CreateFeedResponseDto,
  UpdateFeedResponseDto,
} from "@/apps/web-seller/features/feed/types/feed.dto";
import type { MessageResponseDto } from "@/apps/web-seller/common/types/api.dto";

export const feedApi = {
  // 피드 목록 조회
  getFeeds: async (storeId: string, params: FeedListRequestDto): Promise<FeedListResponseDto> => {
    const response = await sellerClient.get(`/store/${storeId}/feed`, { params });
    return response.data.data;
  },

  // 피드 상세 조회
  getFeedDetail: async (storeId: string, feedId: string): Promise<FeedResponseDto> => {
    const response = await sellerClient.get(`/store/${storeId}/feed/${feedId}`);
    return response.data.data;
  },

  // 피드 등록
  createFeed: async (
    storeId: string,
    request: CreateFeedRequestDto,
  ): Promise<CreateFeedResponseDto> => {
    const response = await sellerClient.post(`/store/${storeId}/feed`, request);
    return response.data.data;
  },

  // 피드 수정
  updateFeed: async (
    storeId: string,
    feedId: string,
    request: UpdateFeedRequestDto,
  ): Promise<UpdateFeedResponseDto> => {
    const response = await sellerClient.put(`/store/${storeId}/feed/${feedId}`, request);
    return response.data.data;
  },

  // 피드 삭제
  deleteFeed: async (storeId: string, feedId: string): Promise<MessageResponseDto> => {
    const response = await sellerClient.delete(`/store/${storeId}/feed/${feedId}`);
    return response.data.data;
  },
};
