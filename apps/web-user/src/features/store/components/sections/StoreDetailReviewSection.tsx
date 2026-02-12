"use client";

import { useRef, useState } from "react";
import { Review, ReviewSortBy } from "@/apps/web-user/features/review/types/review.type";
import { useStoreReviews } from "@/apps/web-user/features/review/hooks/queries/useStoreReviews";
import { ReviewList } from "@/apps/web-user/common/components/reviews";
import { useInfiniteScroll } from "@/apps/web-user/common/hooks/useInfiniteScroll";
import { flattenAndDeduplicateInfiniteData } from "@/apps/web-user/common/utils/pagination.util";

interface StoreDetailReviewSectionProps {
  storeId: string;
}

export function StoreDetailReviewSection({ storeId }: StoreDetailReviewSectionProps) {
  const [sortBy, setSortBy] = useState<ReviewSortBy>(ReviewSortBy.LATEST);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useStoreReviews({
    storeId,
    sortBy,
  });

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    loadMoreRef,
  });

  const reviews = flattenAndDeduplicateInfiniteData<Review>(data);
  const totalCount = data?.pages[0]?.meta?.totalItems;

  const handleSortChange = (newSortBy: ReviewSortBy) => {
    setSortBy(newSortBy);
  };

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="pt-[10px]">
      <ReviewList
        reviews={reviews}
        totalCount={totalCount}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      {/* 무한 스크롤 트리거 */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center items-center py-4">
          {isFetchingNextPage && (
            <div className="text-gray-500 text-sm">더 많은 후기를 불러오는 중...</div>
          )}
        </div>
      )}
    </div>
  );
}
