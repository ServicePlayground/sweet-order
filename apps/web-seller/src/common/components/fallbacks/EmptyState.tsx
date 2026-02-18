import React from "react";

interface EmptyStateProps {
  message?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "데이터가 없습니다.",
  className,
}) => {
  return (
    <div className={`flex items-center justify-center py-12 text-muted-foreground ${className || ""}`}>
      <p>{message}</p>
    </div>
  );
};

