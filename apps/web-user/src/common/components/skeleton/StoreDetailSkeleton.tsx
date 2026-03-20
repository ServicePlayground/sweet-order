import { Skeleton, SkeletonCircle, SkeletonText } from "./Skeleton";

export function StoreDetailSkeleton() {
  return (
    <div className="w-full">
      <div className="px-[20px] py-5 space-y-4">
        {/* 스토어 프로필 */}
        <div className="flex items-center gap-3">
          <SkeletonCircle className="w-[56px] h-[56px]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32 rounded" />
            <SkeletonText className="w-48" />
          </div>
        </div>
        {/* 스토어 설명 */}
        <div className="space-y-1.5">
          <SkeletonText className="w-full" />
          <SkeletonText className="w-3/4" />
        </div>
        {/* 버튼 영역 */}
        <div className="flex gap-2">
          <Skeleton className="flex-1 h-[40px] rounded-lg" />
          <Skeleton className="flex-1 h-[40px] rounded-lg" />
        </div>
      </div>

      {/* 탭 */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {["상품", "후기", "피드"].map((tab) => (
            <div key={tab} className="flex-1 py-3 flex justify-center">
              <SkeletonText className="w-10" />
            </div>
          ))}
        </div>
      </div>

      {/* 상품 그리드 */}
      <div className="px-5 py-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="w-full aspect-square rounded-xl" />
            <div className="mt-2 space-y-1.5">
              <SkeletonText className="w-16" />
              <SkeletonText className="w-full" />
              <SkeletonText className="w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
