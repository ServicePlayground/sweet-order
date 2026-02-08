import { sellerClient } from "@/apps/web-seller/common/config/axios.config";
import {
  ICreateFeedRequest,
  IUpdateFeedRequest,
  IGetFeedsRequest,
  IFeed,
  IFeedListResponse,
} from "@/apps/web-seller/features/feed/types/feed.type";
import { MessageResponse } from "@/apps/web-seller/common/types/api.type";

export const feedApi = {
  // 피드 목록 조회
  getFeeds: async (storeId: string, params: IGetFeedsRequest): Promise<IFeedListResponse> => {
    const response = await sellerClient.get(`/store/${storeId}/feed`, { params });
    return response.data.data;
  },

  // 피드 상세 조회
  getFeedDetail: async (storeId: string, feedId: string): Promise<IFeed> => {
    const response = await sellerClient.get(`/store/${storeId}/feed/${feedId}`);
    return response.data.data;
  },

  // 피드 등록
  createFeed: async (storeId: string, request: ICreateFeedRequest): Promise<IFeed> => {
    const response = await sellerClient.post(`/store/${storeId}/feed`, request);
    return response.data.data;
  },

  // 피드 수정
  updateFeed: async (
    storeId: string,
    feedId: string,
    request: IUpdateFeedRequest,
  ): Promise<IFeed> => {
    const response = await sellerClient.put(`/store/${storeId}/feed/${feedId}`, request);
    return response.data.data;
  },

  // 피드 삭제
  deleteFeed: async (storeId: string, feedId: string): Promise<MessageResponse> => {
    const response = await sellerClient.delete(`/store/${storeId}/feed/${feedId}`);
    return response.data.data;
  },
};
