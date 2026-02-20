"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/apps/web-user/common/components/icons";
import { useUserCurrentLocationStore } from "@/apps/web-user/common/store/user-current-location.store";
import { useAuthStore } from "@/apps/web-user/common/store/auth.store";
import {
  navigateToLoginPage,
  logoutFromWebView,
} from "@/apps/web-user/common/utils/webview.bridge";

interface HeaderProps {
  variant?: "main" | "product" | "minimal";
}

export default function Header({ variant = "main" }: HeaderProps) {
  const router = useRouter();
  const { address } = useUserCurrentLocationStore();
  const { isAuthenticated } = useAuthStore();

  // 장바구니 버튼 컴포넌트 (공통) - UI만 표시
  const CartButton = () => (
    <div
      className="relative flex items-center justify-center rounded-lg text-gray-900 transition-all hover:bg-gray-100"
      aria-label="장바구니"
    >
      <Icon name="cart" width={24} height={24} />
    </div>
  );

  // Product 헤더: 뒤로가기 + 장바구니
  if (variant === "product") {
    return (
      <header className="sticky top-0 z-50 bg-white px-5 flex justify-between items-center h-[52px]">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center rounded-lg border-none bg-transparent text-gray-900 cursor-pointer transition-all hover:bg-gray-100"
          aria-label="뒤로가기"
        >
          <Icon name="chevronLeft" width={24} height={24} className="text-gray-900" />
        </button>

        {/* 장바구니 버튼 */}
        <CartButton />
      </header>
    );
  }

  // Minimal 헤더: 헤더 없음
  if (variant === "minimal") {
    return null;
  }

  // Main 헤더 (기본): 로고 + 장바구니
  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white max-w-[638px] mx-auto px-5 flex justify-between items-center h-[52px]">
      {/* 로고 */}
      <button type="button" className="flex items-center justify-center">
        <Icon name="location" width={20} height={20} className="text-primary" />
        <span className="font-bold text-gray-900">
          {address ?? "위치를 불러오는 중..."}
        </span>
        <Icon name="arrow" width={20} height={20} className="text-gray-900 rotate-180" />
      </button>

      {/* 우측 메뉴 */}
      <div className="flex items-center gap-4">
        {/* 로그인/로그아웃 버튼 (임시) */}
        {!isAuthenticated ? (
          <button
            onClick={navigateToLoginPage}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-gray-900 border-none rounded-lg cursor-pointer"
          >
            로그인(임시 테스트)
          </button>
        ) : (
          <button
            onClick={logoutFromWebView}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 border-none rounded-lg cursor-pointer"
          >
            로그아웃(임시 테스트)
          </button>
        )}
        {/* 장바구니 아이콘 */}
        <CartButton />
      </div>
    </header>
  );
}