"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/apps/web-user/common/components/headers/Header";
import { Alert } from "@/apps/web-user/common/components/alerts/Alert";
import { ConfirmAlert } from "@/apps/web-user/common/components/alerts/ConfirmAlert";
import { AuthProvider } from "@/apps/web-user/common/components/providers/AuthProvider";

interface RootWrapperLayoutProps {
  children: ReactNode;
}

export default function RootWrapperLayout({ children }: RootWrapperLayoutProps) {
  const pathname = usePathname();

  // pathname에 따라 헤더 variant 결정
  const getHeaderVariant = (): "main" | "product" | "minimal" => {
    if (pathname === "/") return "main"; // 홈화면에서는 헤더 숨김
    if (pathname === "/search") return "minimal"; // 검색 페이지에서는 헤더 숨김
    if (pathname?.startsWith("/chat")) return "minimal"; // 채팅 페이지에서는 헤더 숨김
    if (pathname?.startsWith("/reservation")) return "minimal"; // 예약 관련 페이지에서는 헤더 숨김
    if (pathname?.startsWith("/product/")) return "product";
    if (pathname?.startsWith("/store/")) return "product";
    return "main";
  };

  const headerVariant = getHeaderVariant();

  return (
    <AuthProvider>
      <div className="w-full sm:w-[640px] h-screen mx-auto sm:border-x border-gray-200 overflow-y-auto overflow-x-hidden">
        <Header variant={headerVariant} />
        <div>{children}</div>
        <Alert />
        <ConfirmAlert />
      </div>
    </AuthProvider>
  );
}
