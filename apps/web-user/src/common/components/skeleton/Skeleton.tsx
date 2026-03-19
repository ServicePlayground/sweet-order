interface SkeletonProps {
  className?: string;
}

/** 기본 스켈레톤 블록 - className으로 w, h, rounded 등을 지정 */
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 ${className}`} />
  );
}

/** 원형 스켈레톤 (프로필 이미지 등) */
export function SkeletonCircle({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-full ${className}`} />
  );
}

/** 텍스트 한 줄 스켈레톤 */
export function SkeletonText({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 h-3.5 rounded ${className}`} />
  );
}
