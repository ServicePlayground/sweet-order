import type { FeedListRequestDto } from "@/apps/web-seller/features/feed/types/feed.dto";

/** 쿼리 키/옵션용 (page 제외, 클라이언트 전용) */
export type FeedListQueryParams = Omit<FeedListRequestDto, "page">;
