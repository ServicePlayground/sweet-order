/**
 * 페이지네이션 메타 정보 계산 유틸 함수
 * @param page - 현재 페이지 번호
 * @param limit - 페이지당 항목 수
 * @param totalItems - 전체 항목 수
 * @returns 페이지네이션 메타 정보 객체
 */
export const calculatePaginationMeta = (
  page: number,
  limit: number,
  totalItems: number,
): {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} => {
  const totalPages = Math.ceil(totalItems / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    currentPage: page,
    limit,
    totalItems,
    totalPages,
    hasNext,
    hasPrev,
  };
};
