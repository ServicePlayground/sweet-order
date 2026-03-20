import { Skeleton } from "@/apps/web-user/common/components/skeleton/Skeleton";

export function RecentProductsSkeleton() {
  return (
    <div className="flex flex-col gap-6 pt-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="w-[120px] h-[120px] rounded-xl shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-6 w-36 rounded-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
