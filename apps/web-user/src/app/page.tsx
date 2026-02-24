"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SearchBar } from "@/apps/web-user/common/components/search/SearchBar";
import BannerSlider from "@/apps/web-user/common/components/sliders/BannerSlider";
import CakeListSlider from "@/apps/web-user/common/components/sliders/CakeListSlider";
import CategoryList from "@/apps/web-user/common/components/categories/CategoryList";
import { useProductList } from "@/apps/web-user/features/product/hooks/queries/useProductList";
import { SortBy, Product } from "@/apps/web-user/features/product/types/product.type";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import Link from "next/link";
import { requestLocationFromWebView } from "@/apps/web-user/common/utils/webview.bridge";
import { useHeaderStore } from "@/apps/web-user/common/store/header.store";
import { Icon } from "../common/components/icons";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [showComingSoon, setShowComingSoon] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const { setIsHomeSearchVisible } = useHeaderStore();

  const { data: latestData, isLoading: isLatestLoading } = useProductList({
    sortBy: SortBy.LATEST,
    limit: 10,
  });

  const { data: popularData, isLoading: isPopularLoading } = useProductList({
    sortBy: SortBy.POPULAR,
    limit: 10,
  });

  useEffect(() => {
    const el = searchBarRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHomeSearchVisible(entry.isIntersecting),
      { rootMargin: "-52px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [setIsHomeSearchVisible]);

  // 페이지 벗어날 때 초기화
  useEffect(() => {
    return () => setIsHomeSearchVisible(true);
  }, [setIsHomeSearchVisible]);

  const handleSearch = (searchValue: string) => {
    if (searchValue.trim()) {
      router.push(`${PATHS.SEARCH}?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const latestProducts: Product[] = latestData?.pages?.[0]?.data?.slice(0, 10) || [];
  const popularProducts: Product[] = popularData?.pages?.[0]?.data?.slice(0, 10) || [];

  const handleProductClick = (productId: string) => {
    router.push(PATHS.PRODUCT.DETAIL(productId));
  };

  return (
    <div className="w-full pb-[110px]">
      {/* 배너 */}
      <BannerSlider />
      {/* 검색 바 */}
      <div className="w-full relative -mt-[30px] pt-[20px] pb-[56px] px-[24px] z-10 rounded-t-4xl bg-white bg-[url('/images/contents/category_bg.png')] bg-top bg-no-repeat">
        <div ref={searchBarRef} className="w-full mb-[20px]">
          <SearchBar
            placeholder="상품을 검색해보세요"
            initialValue={searchTerm}
            onSearch={handleSearch}
            onChange={setSearchTerm}
          />
        </div>
        {/* 카테고리 */}
        <CategoryList />
      </div>

      {/* 신규케이크 (최신순) */}
      <CakeListSlider
        title="신규케이크"
        products={latestProducts}
        isLoading={isLatestLoading}
        onProductClick={handleProductClick}
      />

      {/* 인기케이크 (인기순) */}
      <CakeListSlider
        title="인기케이크"
        products={popularProducts}
        isLoading={isPopularLoading}
        onProductClick={handleProductClick}
      />
      <ul className="fixed bottom-0 left-0 right-0 bg-white flex items-center h-[60px] border-t border-gray-100">
        {[
          { icon: "home", label: "홈", path: PATHS.HOME, ready: true },
          { icon: "map", label: "지도", path: PATHS.MAP, ready: false },
          { icon: "favorite", label: "저장", path: PATHS.SAVED, ready: false },
          { icon: "mypage", label: "MY", path: PATHS.MYPAGE, ready: false },
        ].map(({ icon, label, path, ready }) => {
          const isActive = pathname === path;
          return (
            <li key={label} className="w-[25%]">
              {ready ? (
                <Link
                  href={path}
                  className={`flex flex-col items-center justify-center text-2xs font-bold ${isActive ? "text-primary" : "text-gray-400"}`}
                >
                  <Icon name={icon as any} width={24} height={24} />
                  {label}
                </Link>
              ) : (
                <button
                  onClick={() => setShowComingSoon(true)}
                  className="w-full flex flex-col items-center justify-center text-2xs font-bold text-gray-400"
                >
                  <Icon name={icon as any} width={24} height={24} />
                  {label}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {/* 준비중 모달 */}
      {showComingSoon && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
          onClick={() => setShowComingSoon(false)}
        >
          <div
            className="w-full bg-white rounded-t-3xl px-8 pt-8 pb-12 flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mb-2" />
            <span className="text-6xl">🚧</span>
            <div className="flex flex-col items-center gap-2">
              <p className="text-xl font-bold text-gray-900">준비중입니다</p>
              <p className="text-sm text-gray-400 text-center">더 나은 서비스로 곧 찾아올게요!</p>
            </div>
            <button
              onClick={() => setShowComingSoon(false)}
              className="w-full mt-2 py-4 bg-primary text-white font-bold rounded-2xl"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
