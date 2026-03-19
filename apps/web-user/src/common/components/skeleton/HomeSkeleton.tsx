import { Skeleton, SkeletonText } from "./Skeleton";

function CakeSliderSkeleton() {
  return (
    <div className="pb-9">
      <div className="px-[20px] py-[10px] mb-6">
        <Skeleton className="h-7 w-24 rounded" />
      </div>
      <div className="flex gap-[8px] overflow-hidden pl-[20px]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="min-w-[140px]">
            <Skeleton className="w-[140px] h-[140px] rounded-xl" />
            <div className="mt-2 space-y-1.5">
              <SkeletonText className="w-16" />
              <SkeletonText className="w-24" />
              <SkeletonText className="w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="w-full pb-[110px]">
      {/* 배너 */}
      <Skeleton className="w-full h-[280px]" />
      {/* 검색 + 카테고리 */}
      <div className="w-full relative -mt-[30px] pt-[20px] pb-[56px] px-[24px] z-10 rounded-t-4xl bg-white">
        <Skeleton className="w-full h-[48px] rounded-xl mb-[20px]" />
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-[48px] h-[48px] rounded-full" />
              <SkeletonText className="w-10" />
            </div>
          ))}
        </div>
      </div>
      {/* 케이크 슬라이더 x2 */}
      <CakeSliderSkeleton />
      <CakeSliderSkeleton />
    </div>
  );
}
