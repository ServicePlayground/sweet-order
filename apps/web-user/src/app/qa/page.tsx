"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/apps/web-user/common/store/auth.store";
import { useUserCurrentLocationStore } from "@/apps/web-user/common/store/user-current-location.store";
import { useProductList } from "@/apps/web-user/features/product/hooks/queries/useProductList";
import { useStoreDetail } from "@/apps/web-user/features/store/hooks/queries/useStoreDetail";
import { SortBy, Product } from "@/apps/web-user/features/product/types/product.type";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { Icon } from "@/apps/web-user/common/components/icons";
import {
  navigateToLoginPage,
  logoutFromWebView,
  toExternalAppSchemeUrl,
} from "@/apps/web-user/common/utils/webview.bridge";
import { reverseGeocode } from "@/apps/web-user/common/utils/kakao-geocode.util";

export default function QAPage() {
  const { isAuthenticated } = useAuthStore();
  const { address, latitude, longitude, setLocation, setAddress } = useUserCurrentLocationStore();
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(latitude, longitude);
        const result = await reverseGeocode(latitude, longitude);
        if (result) setAddress(result);
        setLocationStatus("success");
      },
      (error) => {
        console.error("위치 요청 실패:", error.message);
        setLocationStatus("error");
      },
    );
  };

  const { data: latestData } = useProductList({ sortBy: SortBy.LATEST, limit: 10 });
  const { data: popularData } = useProductList({ sortBy: SortBy.POPULAR, limit: 10 });

  const allProducts: Product[] = [
    ...(latestData?.pages?.[0]?.data ?? []),
    ...(popularData?.pages?.[0]?.data ?? []),
  ];
  const uniqueStoreIds = [...new Set(allProducts.map((p) => p.storeId).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 h-[52px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200">
            QA
          </span>
          <span className="font-bold text-gray-900 text-sm">테스트 페이지</span>
        </div>
        <Link
          href={PATHS.HOME}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
        >
          <Icon name="chevronLeft" width={16} height={16} />
          홈으로
        </Link>
      </div>

      <div className="px-5 py-6 flex flex-col gap-6">
        {/* 위치 섹션 */}
        <section className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">위치</h2>
            </div>
            <button
              onClick={handleGetLocation}
              disabled={locationStatus === "loading"}
              className="px-4 py-2 text-xs font-bold text-white bg-green-500 rounded-xl hover:bg-green-400 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {locationStatus === "loading" ? "불러오는 중..." : "현재 위치 가져오기"}
            </button>
          </div>
          <div className="flex flex-col gap-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span className="text-gray-400">주소</span>
              <span className="font-bold text-gray-800">{address ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">위도</span>
              <span>{latitude ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">경도</span>
              <span>{longitude ?? "-"}</span>
            </div>
            {locationStatus === "error" && (
              <p className="text-red-400 text-xs mt-1">위치 권한이 거부됐거나 오류가 발생했습니다.</p>
            )}
          </div>
        </section>

        {/* 인증 섹션 */}
        <section className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">인증</h2>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${isAuthenticated ? "bg-green-400" : "bg-red-400"}`}
              />
              <span className="text-sm text-gray-700">
                {isAuthenticated ? "로그인됨" : "로그아웃 상태"}
              </span>
            </div>
            {!isAuthenticated ? (
              <button
                onClick={navigateToLoginPage}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-500 rounded-xl hover:bg-blue-400 transition-colors"
              >
                로그인
              </button>
            ) : (
              <button
                onClick={logoutFromWebView}
                className="px-4 py-2 text-xs font-bold text-white bg-red-500 rounded-xl hover:bg-red-400 transition-colors"
              >
                로그아웃
              </button>
            )}
          </div>
        </section>

        {/* 페이지 링크 섹션 */}
        <section className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              페이지 이동
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href={PATHS.HOME}
              className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <span>홈</span>
              <Icon name="arrow" width={16} height={16} className="rotate-90 text-gray-400" />
            </Link>

            {/* 스토어 목록 */}
            <div className="flex items-center justify-between px-1 pt-2 pb-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                스토어 목록
              </span>
              <span className="text-xs text-gray-400">{uniqueStoreIds.length}개</span>
            </div>
            {uniqueStoreIds.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">스토어 데이터 없음</p>
            ) : (
              uniqueStoreIds.map((storeId) => <StoreItem key={storeId} storeId={storeId} />)
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StoreItem({ storeId }: { storeId: string }) {
  const { data: store } = useStoreDetail(storeId);

  const handleNaverClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (store) {
      const appUrl = `nmap://map?lat=${store.latitude}&lng=${store.longitude}&zoom=15&appname=com.example.sweetorder`;
      window.location.href = toExternalAppSchemeUrl(appUrl);
    }
  };

  const handleKakaoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (store) {
      const appUrl = `kakaomap://look?p=${store.latitude},${store.longitude}`;
      window.location.href = toExternalAppSchemeUrl(appUrl);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/store/${storeId}`}
        className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors truncate"
      >
        🏪 {storeId}
      </Link>
      {store && (
        <>
          <button
            onClick={handleNaverClick}
            className="px-3 py-3 text-xs font-bold text-white bg-[#03C75A] rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            네이버
          </button>
          <button
            onClick={handleKakaoClick}
            className="px-3 py-3 text-xs font-bold text-black bg-[#FEE500] rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            카카오
          </button>
        </>
      )}
    </div>
  );
}
