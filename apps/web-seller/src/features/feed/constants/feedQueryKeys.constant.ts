import { IGetFeedsParams } from "@/apps/web-seller/features/feed/types/feed.type";

/**
 * Feed 관련 쿼리 키 상수
 */
export const feedQueryKeys = {
  all: ["feed"] as const,
  lists: () => ["feed", "list"] as const,
  list: (params: IGetFeedsParams) => ["feed", "list", params] as const,
  details: () => ["feed", "detail"] as const,
  detail: (feedId: string) => ["feed", "detail", feedId] as const,
} as const;
