import { Skeleton, SkeletonCircle, SkeletonText } from "./Skeleton";

function ChatRoomItemSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3">
      <SkeletonCircle className="w-[48px] h-[48px]" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 rounded" />
          <SkeletonText className="w-12" />
        </div>
        <SkeletonText className="w-3/4" />
      </div>
    </div>
  );
}

export function ChatListSkeleton() {
  return (
    <div className="space-y-1 px-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <ChatRoomItemSkeleton key={i} />
      ))}
    </div>
  );
}
