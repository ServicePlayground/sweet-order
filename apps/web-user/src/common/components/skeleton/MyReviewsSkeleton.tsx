import { Skeleton, SkeletonText } from "./Skeleton";

function ReviewItemSkeleton() {
  return (
    <div className="pt-6 pb-12 border-b border-gray-100">
      {/* 스토어명 */}
      <div className="flex items-center justify-between mb-1">
        <SkeletonText className="w-24" />
        <SkeletonText className="w-8" />
      </div>
      {/* 별점 + 날짜 */}
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="w-[18px] h-[18px] rounded-full" />
        <SkeletonText className="w-6" />
        <SkeletonText className="w-20" />
      </div>
      {/* 후기 내용 */}
      <div className="space-y-1.5 mb-3">
        <SkeletonText className="w-full" />
        <SkeletonText className="w-full" />
        <SkeletonText className="w-2/3" />
      </div>
      {/* 상품 정보 */}
      <Skeleton className="w-full h-[64px] rounded-xl" />
    </div>
  );
}

export function MyReviewsSkeleton() {
  return (
    <div className="px-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <ReviewItemSkeleton key={i} />
      ))}
    </div>
  );
}
