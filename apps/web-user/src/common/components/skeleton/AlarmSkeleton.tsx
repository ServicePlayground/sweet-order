import { SkeletonCircle, SkeletonText } from "./Skeleton";

function AlarmItemSkeleton() {
  return (
    <div className="flex items-center gap-[10px] py-[14px]">
      <SkeletonCircle className="w-[42px] h-[42px] shrink-0" />
      <div className="flex-1 space-y-[6px] min-w-0">
        <SkeletonText className="w-32" />
        <SkeletonText className="w-48" />
      </div>
      <SkeletonText className="w-16 shrink-0" />
    </div>
  );
}

export function AlarmSkeleton() {
  return (
    <div className="px-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <AlarmItemSkeleton key={i} />
      ))}
    </div>
  );
}
