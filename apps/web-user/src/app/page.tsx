"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/apps/web-user/common/components/search/SearchBar";
import BannerSlider from "@/apps/web-user/common/components/sliders/BannerSlider";
import CakeListSlider from "@/apps/web-user/common/components/sliders/CakeListSlider";
import CategoryList from "@/apps/web-user/common/components/categories/CategoryList";
import { useProductList } from "@/apps/web-user/features/product/hooks/queries/useProductList";
import { SortBy, Product } from "@/apps/web-user/features/product/types/product.type";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import Link from "next/link";
import {
  navigateToLoginPage,
  logoutFromWebView,
  requestLocationFromWebView,
  toExternalAppSchemeUrl,
} from "@/apps/web-user/common/utils/webview.bridge";
import { useStoreDetail } from "@/apps/web-user/features/store/hooks/queries/useStoreDetail";

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: latestData, isLoading: isLatestLoading } = useProductList({
    sortBy: SortBy.LATEST,
    limit: 10,
  });

  const { data: popularData, isLoading: isPopularLoading } = useProductList({
    sortBy: SortBy.POPULAR,
    limit: 10,
  });

  const handleSearch = (searchValue: string) => {
    if (searchValue.trim()) {
      router.push(`${PATHS.SEARCH}?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const latestProducts: Product[] = latestData?.pages?.[0]?.data?.slice(0, 10) || [];
  const popularProducts: Product[] = popularData?.pages?.[0]?.data?.slice(0, 10) || [];

  const allProducts = [...latestProducts, ...popularProducts];
  const uniqueStoreIds = [...new Set(allProducts.map((p) => p.storeId).filter(Boolean))];

  const handleProductClick = (productId: string) => {
    router.push(PATHS.PRODUCT.DETAIL(productId));
  };

  return (
    <div className="w-full">

      {/* 배너 */}
      <BannerSlider />

      {/* 카테고리 */}
      {/* 검색 바 */}
      <div className="w-full relative -mt-[30px] pt-[20px] pb-[56px] px-[24px] z-10 rounded-4xl bg-white bg-[url('/images/contents/category_bg.png')] bg-bottom bg-no-repeat">
        <div className="w-full mb-[20px]">
          <SearchBar
            placeholder="상품을 검색해보세요"
            initialValue={searchTerm}
            onSearch={handleSearch}
            onChange={setSearchTerm}
          />
        </div>
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

      {/* 스토어 목록 (QA용) */}
      {uniqueStoreIds.length > 0 && (
        <div className="mb-[60px]">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            스토어 목록 (QA용)
          </h2>
          <div className="flex flex-col gap-3">
            {uniqueStoreIds.map((storeId) => (
              <Link
                key={storeId}
                href={`/store/${storeId}`}
                className="p-4 bg-gray-100 rounded-lg text-gray-900 no-underline text-sm font-medium"
              >
                🏪 스토어: {storeId}
              </Link>
            ))}
          </div>
        </div>
      )}
      {uniqueStoreIds.length > 0 && <StoreListSection storeIds={uniqueStoreIds} />}
    </div>
  );
}

// 스토어 목록 섹션 컴포넌트
function StoreListSection({ storeIds }: { storeIds: string[] }) {
  return (
    <div style={{ marginBottom: "60px" }}>
      <h2
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "#111827",
          marginBottom: "24px",
        }}
      >
        스토어 목록 (QA용)
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {storeIds.map((storeId) => (
          <StoreItem key={storeId} storeId={storeId} />
        ))}
      </div>
    </div>
  );
}

// 스토어 아이템 컴포넌트
function StoreItem({ storeId }: { storeId: string }) {
  const { data: store } = useStoreDetail(storeId);

  const handleNaverClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (store) {
      // 네이버지도 앱 딥링크 (설치되어 있으면 앱으로 바로 이동)
      const appUrl = `nmap://map?lat=${store.latitude}&lng=${store.longitude}&zoom=15&appname=com.example.sweetorder`;
      window.location.href = toExternalAppSchemeUrl(appUrl);
    }
  };

  const handleKakaoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (store) {
      // 카카오맵 앱 딥링크 (설치되어 있으면 앱으로 바로 이동)
      const appUrl = `kakaomap://look?p=${store.latitude},${store.longitude}`;
      window.location.href = toExternalAppSchemeUrl(appUrl);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <Link
        href={`/store/${storeId}`}
        style={{
          flex: 1,
          padding: "16px",
          backgroundColor: "#f3f4f6",
          borderRadius: "8px",
          color: "#111827",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        🏪 스토어: {storeId}
      </Link>
      {store && (
        <>
          <button
            onClick={handleNaverClick}
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#ffffff",
              backgroundColor: "#03C75A",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            네이버
          </button>
          <button
            onClick={handleKakaoClick}
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#000000",
              backgroundColor: "#FEE500",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            카카오
          </button>
        </>
      )}
    </div>
  );
}
