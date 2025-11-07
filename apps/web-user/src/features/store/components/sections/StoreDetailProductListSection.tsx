"use client";

import { useState, useRef } from "react";
import { useProductList } from "@/apps/web-user/features/product/hooks/queries/useProductList";
import { SortBy, Product } from "@/apps/web-user/features/product/types/product.type";
import { LoadingFallback } from "@/apps/web-user/common/components/fallbacks/LoadingFallback";
import { StoreDetailProductList } from "@/apps/web-user/features/product/components/StoreDetailProductList";
import { Select } from "@/apps/web-user/common/components/selectboxs/Select";
import { useInfiniteScroll } from "@/apps/web-user/common/hooks/useInfiniteScroll";

interface StoreDetailProductListSectionProps {
  storeId: string;
}

export function StoreDetailProductListSection({ storeId }: StoreDetailProductListSectionProps) {
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.POPULAR);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage, // 다음 페이지 요청
    hasNextPage, // 다음 페이지 존재 여부
    isFetchingNextPage, // 다음 페이지 로딩 여부
    isLoading, // 첫 번째 페이지 로딩 여부
  } = useProductList({
    storeId,
    sortBy,
  });

  // 무한 스크롤 훅 사용
  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    loadMoreRef,
  });

  // 상품 목록 평탄화
  const products: Product[] = data?.pages.flatMap((page) => page.data) || [];

  if (isLoading) {
    return <LoadingFallback message="상품 목록을 불러오는 중..." />;
  }

  if (products.length === 0) {
    return <div>등록된 상품이 없습니다.</div>;
  }

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: "#111827",
          marginBottom: "24px",
        }}
      >
        상품 목록
      </h2>
      <div ref={containerRef}>
        {/* 정렬 선택 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
            padding: "16px 24px",
            backgroundColor: "#f9fafb",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#374151",
            }}
          >
            정렬:
          </span>
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
        <StoreDetailProductList products={products} />

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
      </div>
    </div>
  );
}

