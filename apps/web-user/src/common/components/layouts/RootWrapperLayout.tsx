"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/apps/web-user/common/components/headers/Header";
import { AuthInitializerProvider } from "@/apps/web-user/features/auth/components/providers/AuthInitializer";
import { Alert } from "@/apps/web-user/common/components/alerts/Alert";
import { ConfirmAlert } from "@/apps/web-user/common/components/alerts/ConfirmAlert";

interface RootWrapperLayoutProps {
  children: ReactNode;
}

export default function RootWrapperLayout({ children }: RootWrapperLayoutProps) {
  const pathname = usePathname();

  // pathname에 따라 헤더 variant 결정
  const getHeaderVariant = (): "main" | "product" | "minimal" => {
    if (pathname?.startsWith("/auth")) return "minimal";
    if (pathname?.startsWith("/product/")) return "product";
    return "main";
  };

  return (
    <div className="w-[375px] h-screen mx-auto border-x border-gray-200 overflow-y-auto">
      <Header variant={getHeaderVariant()} />
      <div>{children}</div>
      <AuthInitializerProvider />
      <Alert />
      <ConfirmAlert />
    </div>
  );
}
