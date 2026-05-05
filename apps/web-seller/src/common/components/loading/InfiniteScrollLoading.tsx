import { cn } from "@/apps/web-seller/common/utils/classname.util";
import { LoadingSpinner } from "@/apps/web-seller/common/components/loading/LoadingSpinner";

interface InfiniteScrollLoadingProps {
  message?: string;
  className?: string;
}

/** 무한 스크롤 하단 “추가 로딩” */
export function InfiniteScrollLoading({
  message = "더 불러오는 중…",
  className,
}: InfiniteScrollLoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-8 text-sm font-medium text-zinc-500",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner size="md" />
      <span>{message}</span>
    </div>
  );
}
