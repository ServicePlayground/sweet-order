import { InfiniteData } from "@tanstack/react-query";

/**
 * InfiniteData에서 페이지 데이터를 평탄화하고 중복을 제거하는 유틸 함수
 * @param data - useInfiniteQuery에서 반환된 InfiniteData
 * @param dataKey - 페이지 객체에서 추출할 데이터 필드명 (기본값: 'data')
 * @returns 평탄화되고 중복이 제거된 배열
 */
export function flattenAndDeduplicateInfiniteData<T extends { id: string }>(
  data: InfiniteData<{ [key: string]: any }> | undefined,
  dataKey: string = "data",
): T[] {
  if (!data?.pages) {
    return [];
  }

  const flattened = data.pages.flatMap((page) => {
    const pageData = page[dataKey];
    return Array.isArray(pageData) ? (pageData as T[]) : [];
  });

  // id 기준으로 중복 제거
  return flattened.filter((item, index, self) => self.findIndex((i) => i.id === item.id) === index);
}
