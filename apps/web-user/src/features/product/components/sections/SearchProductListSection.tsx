"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useProductList } from "@/apps/web-user/features/product/hooks/queries/useProductList";
import { SortBy, Product } from "@/apps/web-user/features/product/types/product.type";
import { CakeListItem } from "@/apps/web-user/features/product/components/cards/CakeListItem";
import { useInfiniteScroll } from "@/apps/web-user/common/hooks/useInfiniteScroll";
import { flattenAndDeduplicateInfiniteData } from "@/apps/web-user/common/utils/pagination.util";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";

interface SearchProductListSectionProps {
  search?: string;
}

export function SearchProductListSection({ search }: SearchProductListSectionProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useProductList({
    search: search?.trim() || undefined,
    sortBy: SortBy.POPULAR,
  });

  useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage, loadMoreRef });

  const products = flattenAndDeduplicateInfiniteData<Product>(data);

  if (isLoading) return <></>;

  if (products.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-10">검색 결과가 없습니다.</p>;
  }

  return (
    <>
      <p className="text-sm text-gray-500 py-3 font-bold">총 <span className="text-gray-900">{products.length}</span>개</p>
      <div className="grid grid-cols-2 gap-x-[7px] gap-y-6">
        {products.map((product) => (
          <CakeListItem
            key={product.id}
            product={product}
            onCardClick={(id) => router.push(PATHS.PRODUCT.DETAIL(id))}
          />
        ))}
      </div>
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center items-center py-8 min-h-[100px]">
          {isFetchingNextPage && (
            <div className="flex flex-col items-center gap-3 text-sm text-gray-400">
              <div className="loading-spinner-small" />
              <span>더 많은 상품을 불러오는 중...</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
