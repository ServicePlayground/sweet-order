"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/apps/web-user/common/components/icons";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { BottomNav } from "@/apps/web-user/common/components/navigation/BottomNav";

export default function MypagePage() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-60px)]">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white px-5 flex justify-between items-center h-[52px]">
        <h1 className="text-base font-bold text-gray-900">My</h1>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push(PATHS.SEARCH)}
            className="flex items-center justify-center"
          >
            <Icon name="search" width={24} height={24} className="text-gray-900" />
          </button>
          <Link href={PATHS.ALARM} className="flex items-center justify-center">
            <Icon name="alarm" width={24} height={24} className="text-gray-900" />
          </Link>
          {/* TODO: 설정 아이콘 추가 예정 */}
          <button type="button" className="w-6 h-6 flex items-center justify-center">
            <span className="sr-only">설정</span>
          </button>
        </div>
      </header>
      <BottomNav />
    </div>
  );
}
