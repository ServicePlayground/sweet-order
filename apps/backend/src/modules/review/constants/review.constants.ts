export const REVIEW_ERROR_MESSAGES = {
  REVIEW_NOT_FOUND: "후기를 찾을 수 없습니다.",
  REVIEW_FORBIDDEN: "본인이 작성한 후기만 삭제할 수 있습니다.",
} as const;

export const REVIEW_SUCCESS_MESSAGES = {
  REVIEW_DELETED: "후기가 삭제되었습니다.",
} as const;

export enum ReviewSortBy {
  LATEST = "latest", // 최신순(생성일 내림차순)
  RATING_DESC = "rating_desc", // 별점 내림차순
  RATING_ASC = "rating_asc", // 별점 오름차순
}
