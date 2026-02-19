import { PaginationMeta } from "@/apps/web-seller/common/types/api.type";

/**
 * 피드 생성 요청
 */
export interface ICreateFeedRequest {
  storeId: string;
  title: string;
  content: string;
}

/**
 * 피드 수정 요청
 */
export interface IUpdateFeedRequest {
  title: string;
  content: string;
}

/**
 * 피드 목록 조회 쿼리 키용 파라미터 (page 제외)
 */
export interface IGetFeedsParams {
  storeId: string;
  limit: number;
}

/**
 * 피드 목록 조회 요청 파라미터 (storeId는 URL 경로에 포함되므로 제외)
 */
export interface IGetFeedsRequest {
  page: number;
  limit: number;
}

/**
 * 피드 응답
 */
export interface IFeed {
  id: string;
  storeId: string;
  title: string;
  content: string;
  storeLogoImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 피드 생성/수정 응답
 */
export interface IFeedMutationResponse {
  id: string;
}

/**
 * 피드 목록 응답
 */
export interface IFeedListResponse {
  data: IFeed[];
  meta: PaginationMeta;
}
