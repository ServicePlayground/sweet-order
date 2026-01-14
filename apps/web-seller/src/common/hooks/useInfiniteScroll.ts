import { useEffect, RefObject } from "react";

interface UseInfiniteScrollOptions {
  hasNextPage: boolean | undefined; // 다음 페이지를 가져올 수 있는지 여부
  isFetchingNextPage: boolean | undefined; // 다음 페이지를 가져오는 중인지 여부
  fetchNextPage: () => void; // 다음 페이지를 가져오는 함수
  loadMoreRef: RefObject<HTMLDivElement | null>; // 무한 스크롤 감지를 위한 ref
  enabled?: boolean; // 무한 스크롤을 활성화할지 여부
}

/**
 * 무한 스크롤을 처리하는 커스텀 훅
 * useInfiniteQuery 결과와 loadMoreRef를 받아서 무한 스크롤을 처리합니다.
 * Intersection Observer를 사용하여 하단 감지하여 useInfiniteQuery의 fetchNextPage 함수를 호출합니다.
 */
export function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  loadMoreRef,
  enabled = true,
}: UseInfiniteScrollOptions) {
  useEffect(() => {
    if (!enabled || !loadMoreRef.current || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const currentRef = loadMoreRef.current;
    if (!currentRef) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, enabled]);
}




