import { cn } from "@/apps/web-seller/common/utils/classname.util";
import { LoadingSpinner } from "@/apps/web-seller/common/components/loading/LoadingSpinner";

interface FetchStatusInlineProps {
  message?: string;
  className?: string;
}

/** 백그라운드 리페치 등 짧은 상태 표시 (헤더 옆 등) */
export function FetchStatusInline({
  message = "업데이트 중…",
  className,
}: FetchStatusInlineProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500", className)}
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner size="sm" aria-hidden />
      {message}
    </span>
  );
}
