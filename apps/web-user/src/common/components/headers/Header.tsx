"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/apps/web-user/common/components/icons";
import { useUserCurrentLocationStore } from "@/apps/web-user/common/store/user-current-location.store";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { useHeaderStore } from "@/apps/web-user/common/store/header.store";

interface HeaderProps {
  variant?: "main" | "product" | "minimal" | "search" | "back-title";
  title?: string;
}

export default function Header({ variant = "main", title }: HeaderProps) {
  const router = useRouter();
  const { address } = useUserCurrentLocationStore();
  const { isHomeSearchVisible } = useHeaderStore();

  // 장바구니 버튼 컴포넌트 (공통)
  const CartButton = () => (
    <div
      className="relative flex items-center justify-center rounded-lg text-gray-900"
      aria-label="장바구니"
    >
      <Icon name="cart" width={24} height={24} />
    </div>
  );

  // 알람 버튼 컴포넌트 (공통)
  const AlarmButton = () => (
    <Link
      href={PATHS.ALARM}
      className="relative flex items-center justify-center rounded-lg text-gray-900"
      aria-label="알람"
    >
      <Icon name="alarm" width={24} height={24} />
    </Link>
  );

  // 뒤로가기 + 타이틀
  if (variant === "back-title") {
    return (
      <header className="sticky top-0 z-50 bg-white px-5 relative flex items-center justify-center h-[52px]">
        <button
          onClick={() => router.back()}
          className="absolute left-5 flex items-center justify-center rounded-lg border-none bg-transparent text-gray-900 cursor-pointer"
          aria-label="뒤로가기"
        >
          <Icon name="chevronLeft" width={24} height={24} className="text-gray-900" />
        </button>
        {title && <h1 className="text-sm font-bold text-gray-900">{title}</h1>}
      </header>
    );
  }

  // 뒤로가기 + 장바구니
  if (variant === "product") {
    return (
      <header className="sticky top-0 z-50 bg-white px-5 flex justify-between items-center h-[52px]">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center rounded-lg border-none bg-transparent text-gray-900 cursor-pointer"
          aria-label="뒤로가기"
        >
          <Icon name="chevronLeft" width={24} height={24} className="text-gray-900" />
        </button>

        {/* 장바구니 버튼 */}
        <CartButton />
      </header>
    );
  }

  // 헤더 없음
  if (variant === "minimal") {
    return null;
  }

  // 로고 + 취소
  if (variant === "search") {
    return (
      <header className="sticky top-0 left-0 right-0 z-50 bg-white max-w-[638px] mx-auto px-5 flex justify-between items-center h-[46px]">
        <button type="button" className="flex items-center justify-center">
          <Icon name="location" width={20} height={20} className="text-primary" />
          <span className="font-bold text-gray-900 ml-1">
            {address ?? "위치를 불러오는 중..."}
          </span>
          <Icon name="arrow" width={20} height={20} className="text-gray-900 rotate-180" />
        </button>
        <button
          onClick={() => router.push(PATHS.HOME)}
          className="text-sm font-bold text-gray-500 underline"
        >
          취소
        </button>
      </header>
    );
  }

  // 로고 + 알람 
  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white max-w-[638px] mx-auto px-5 flex justify-between items-center h-[52px]">
      {/* 로고 */}
      <button type="button" className="flex items-center justify-center">
        <Icon name="location" width={20} height={20} className="text-primary" />
        <span className="font-bold text-gray-900 ml-1">{address ?? "위치를 불러오는 중..."}</span>
        <Icon name="arrow" width={20} height={20} className="text-gray-900 rotate-180" />
      </button>

      {/* 우측 메뉴 */}
      <div className="flex items-center gap-4">
        {/* QA 페이지 링크 */}
        <Link
          href={PATHS.QA}
          className="px-3 py-1.5 text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded-lg"
        >
          QA
        </Link>
        {/* 검색 아이콘 - 홈 검색바가 가려질 때만 표시 */}
        {!isHomeSearchVisible && (
          <button
            onClick={() => router.push(PATHS.SEARCH)}
            className="h-6 w-6 flex items-center justify-center"
          >
            <Icon name="search" width={24} height={24} />
          </button>
        )}
        {/* 알람 아이콘 */}
        <AlarmButton />
      </div>
    </header>
  );
}
