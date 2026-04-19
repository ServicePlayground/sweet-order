"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/apps/web-user/common/components/icons";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { BottomNav } from "@/apps/web-user/common/components/navigation/BottomNav";
import { Modal } from "@/apps/web-user/common/components/modals/Modal";
import { useMypageProfile } from "@/apps/web-user/features/mypage/hooks/queries/useMypageProfile";
import { useAuthStore, useAuthHasHydrated } from "@/apps/web-user/common/store/auth.store";
import {
  isWebViewEnvironment,
  requestGoogleLoginInWebView,
} from "@/apps/web-user/common/utils/webview.bridge";
import { UpcomingOrderCard } from "../../features/order/components/UpcomingOrderCard";
import { useMyOrders } from "@/apps/web-user/features/order/hooks/queries/useMyOrders";
import { OrderStatus } from "@/apps/web-user/features/order/types/order.type";

function getLoginInfo(user: { googleId: string; googleEmail: string; phone: string }) {
  if (user.googleId && user.googleEmail) {
    return (
      <div className="flex items-center gap-[6px]">
        <span className="px-1 py-0.5 bg-gray-50 text-2xs font-bold rounded-sm">구글</span>
        {user.googleEmail}
      </div>
    );
  }
  return user.phone;
}

const QUICK_LINKS = [
  { icon: "reservation", label: "내 예약", href: PATHS.MY_ORDERS },
  { icon: "review", label: "내 후기", href: PATHS.MY_REVIEWS },
  { icon: "saved", label: "저장", href: PATHS.SAVED },
  { icon: "recent", label: "최근 본", href: PATHS.RECENT },
] as const;

export default function MypagePage() {
  const { isAuthenticated, setAccessToken } = useAuthStore();
  const hasHydrated = useAuthHasHydrated();
  const { data: user } = useMypageProfile();
  const [isAppGuideOpen, setIsAppGuideOpen] = useState(false);
  const { data: ordersData } = useMyOrders({ type: "UPCOMING" });
  const upcomingCount =
    ordersData?.pages
      .flatMap((p) => p.data)
      .filter(
        (o) =>
          o.orderStatus === OrderStatus.CONFIRMED || o.orderStatus === OrderStatus.PICKUP_PENDING,
      ).length ?? 0;

  return (
    <div className="pb-[60px]">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white px-5 flex justify-between items-center h-[56px]">
        <h1 className="text-xl font-bold text-gray-900">My</h1>
        <div className="flex items-center gap-4">
          <Link href={PATHS.SEARCH} className="flex items-center justify-center">
            <Icon name="search" width={24} height={24} className="text-gray-900" />
          </Link>
          <Link href={PATHS.ALARM} className="flex items-center justify-center">
            <Icon name="alarm" width={24} height={24} className="text-gray-900" />
          </Link>
          <button type="button" className="flex items-center justify-center">
            <Icon name="setting" width={24} height={24} className="text-gray-900" />
          </button>
        </div>
      </header>

      {!hasHydrated ? (
        <div className="px-5 py-5 flex items-center gap-3 mb-3">
          <div className="w-[44px] h-[44px] rounded-full bg-gray-100 animate-pulse shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-5 w-24 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      ) : isAuthenticated ? (
        <>
          {/* 프로필 */}
          <div className="px-5 py-5 flex items-center gap-3 mb-3">
            {/* 프로필 이미지 */}
            <div className="w-[44px] h-[44px] rounded-full bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="프로필"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon name="mypage" width={44} height={44} className="text-gray-400" />
              )}
            </div>

            {/* 유저 정보 */}
            <div className="flex-1">
              <div className="flex flex-col gap-[2px]">
                <p className="text-base font-bold text-gray-900">{user?.nickname}</p>
                <div className="text-2sm text-gray-500">{user ? getLoginInfo(user) : "-"}</div>
              </div>
            </div>
            <button
              type="button"
              className="flex items-center justify-center h-[32px] w-[83px] text-xs font-bold text-gray-900 border border-gray-100 rounded-md"
            >
              프로필 수정
            </button>
          </div>

          <UpcomingOrderCard />

          <ul className="flex py-[10px] mx-5 mb-8 border border-gray-100 rounded-lg">
            {QUICK_LINKS.map(({ icon, label, href }, index) => (
              <li
                key={icon}
                className={`relative flex-1 flex justify-center ${index < QUICK_LINKS.length - 1 ? "after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-5 after:w-px after:bg-gray-50" : ""}`}
              >
                <Link
                  href={href}
                  className="relative flex flex-col items-center gap-2 py-3 text-gray-900 font-bold text-sm"
                >
                  <div className="relative">
                    <Icon name={icon} width={20} height={20} className="text-gray-900" />
                    {icon === "reservation" && upcomingCount > 0 && (
                      <span className="absolute -top-[6px] -right-[8px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold px-1">
                        {upcomingCount}
                      </span>
                    )}
                  </div>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 px-5 py-6 mb-8">
          <p className="text-sm text-gray-700">더욱 편리한 이용을 위해</p>
          <button
            type="button"
            onClick={() => {
              if (isWebViewEnvironment()) {
                requestGoogleLoginInWebView();
              } else if (process.env.NODE_ENV === "development") {
                setAccessToken(process.env.NEXT_PUBLIC_DEV_ACCESS_TOKEN ?? "");
              } else {
                setIsAppGuideOpen(true);
              }
            }}
            className="py-[10px] px-5 text-sm font-bold text-white bg-primary rounded-lg"
          >
            로그인 / 회원가입
          </button>
        </div>
      )}

      {/* 고객 서비스 */}
      <section>
        <p className="px-5 py-2 text-xs text-gray-500">고객 서비스</p>
        {[
          { label: "공지사항", href: PATHS.NOTICE },
          { label: "Q&A", href: PATHS.QNA },
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
          >
            <span className="text-sm font-bold text-gray-900">{label}</span>
            <Icon name="arrow" width={20} height={20} className="text-gray-900 rotate-90" />
          </Link>
        ))}
      </section>

      {/* 기타 */}
      <section className="mt-8 pb-[60px]">
        <p className="px-5 py-2 text-xs text-gray-500">기타</p>
        {[
          { label: "서비스 이용약관", href: "/" },
          { label: "위치정보 이용약관", href: "/" },
          { label: "개인정보 처리방침", href: "/" },
          { label: "버전정보", href: "/" },
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
          >
            <span className="text-sm font-bold text-gray-900">{label}</span>
            <Icon name="arrow" width={20} height={20} className="text-gray-900 rotate-90" />
          </Link>
        ))}
      </section>

      <Modal
        isOpen={isAppGuideOpen}
        onClose={() => setIsAppGuideOpen(false)}
        title="앱을 설치해주세요!"
        description="로그인은 스위트오더 앱에서만 가능합니다."
        confirmText="확인"
        onConfirm={() => setIsAppGuideOpen(false)}
        hideCancel
      />

      <BottomNav />
    </div>
  );
}
