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
    </div>
  );
}
