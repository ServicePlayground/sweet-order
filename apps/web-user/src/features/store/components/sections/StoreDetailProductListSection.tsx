"use client";

import { useState, useRef } from "react";
import { useProductList } from "@/apps/web-user/features/product/hooks/queries/useProductList";
import { SortBy, Product } from "@/apps/web-user/features/product/types/product.type";
import { ProductList } from "@/apps/web-user/features/product/components/list/ProductList";
import { Select } from "@/apps/web-user/common/components/selectboxs/Select";
import { useInfiniteScroll } from "@/apps/web-user/common/hooks/useInfiniteScroll";
import { flattenAndDeduplicateInfiniteData } from "@/apps/web-user/common/utils/pagination.util";

interface StoreDetailProductListSectionProps {
  storeId: string;
}

export function StoreDetailProductListSection({ storeId }: StoreDetailProductListSectionProps) {
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.POPULAR);
  const loadMoreRef = useRef<HTMLDivElement>(null);

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

  // 상품 목록 평탄화 및 중복 제거
  const products = flattenAndDeduplicateInfiniteData<Product>(data);

  if (isLoading) {
    return <></>;
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
      <div>
        {/* 정렬 선택 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            marginBottom: "24px",
          }}
        >
          <Select
            value={sortBy}
            onChange={(value) => setSortBy(value as SortBy)}
            options={[
              { value: SortBy.POPULAR, label: "인기순" },
              { value: SortBy.LATEST, label: "최신순" },
              { value: SortBy.PRICE_ASC, label: "가격 낮은순" },
              { value: SortBy.PRICE_DESC, label: "가격 높은순" },
              { value: SortBy.REVIEW_COUNT, label: "후기 많은순" },
              { value: SortBy.RATING_AVG, label: "별점 높은순" },
            ]}
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
      </div>
    </div>
  );
}
