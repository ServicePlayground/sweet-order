import type { ReactNode } from "react";
import { cn } from "@/apps/web-seller/common/utils/classname.util";

interface AuthCardLayoutProps {
  children: ReactNode;
  className?: string;
}

/** 로그인·계정 찾기 등 비로그인 인증 화면 공통 래퍼 */
export function AuthCardLayout({ children, className }: AuthCardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-10 sm:px-5 sm:py-12">
      <div
        className={cn(
          "w-full max-w-[420px] rounded-2xl border border-zinc-200/90 bg-white p-8 shadow-[0_2px_28px_-6px_rgba(15,23,42,0.1)] sm:p-10",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
