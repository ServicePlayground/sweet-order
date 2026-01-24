"use client";

import { useState, useRef } from "react";
import { useProductList } from "@/apps/web-user/features/product/hooks/queries/useProductList";
import { SortBy, Product } from "@/apps/web-user/features/product/types/product.type";
import { ProductList } from "@/apps/web-user/features/product/components/list/ProductList";
import { Select } from "@/apps/web-user/common/components/selectboxs/Select";
import { useInfiniteScroll } from "@/apps/web-user/common/hooks/useInfiniteScroll";
import { ProductFilters } from "@/apps/web-user/features/product/components/modals/ProductFilterModal";

interface SearchProductListSectionProps {
  search?: string;
  filters?: ProductFilters;
}

export function SearchProductListSection({ search, filters = {} }: SearchProductListSectionProps) {
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.POPULAR);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useProductList({
    search: search?.trim() || undefined,
    sortBy,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  });

  // 무한 스크롤 훅 사용
  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    loadMoreRef,
  });

  // 상품 목록 평탄화 및 중복 제거
  const products: Product[] =
    data?.pages
      ?.flatMap((page) => page.data)
      .filter((product, index, self) => self.findIndex((p) => p.id === product.id) === index) || [];

  if (isLoading) {
    return <></>;
  }

  if (products.length === 0) {
    return <div>등록된 상품이 없습니다.</div>;
  }

  return (
    <>
      <div
        style={{
          marginBottom: "16px",
          fontSize: "14px",
          color: "#6b7280",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>총 {products.length || 0}개의 상품</span>
        <Select
          value={sortBy}
          onChange={(value) => setSortBy(value as SortBy)}
          options={[
            { value: SortBy.POPULAR, label: "인기순" },
            { value: SortBy.LATEST, label: "최신순" },
            { value: SortBy.PRICE_ASC, label: "가격 낮은순" },
            { value: SortBy.PRICE_DESC, label: "가격 높은순" },
          ]}
          style={{ width: "auto", minWidth: "150px" }}
        />
      </div>

      {/* 상품 그리드 */}
      <ProductList products={products} />

      {/* 무한 스크롤 트리거 */}
      {hasNextPage && (
        <div
          ref={loadMoreRef}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "32px",
            minHeight: "100px",
          }}
        >
          {isFetchingNextPage && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              <div className="loading-spinner-small" />
              <span>더 많은 상품을 불러오는 중...</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
