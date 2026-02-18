import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/apps/web-seller/common/components/@shadcn-ui/select";
import { useProductList } from "@/apps/web-seller/features/product/hooks/queries/useProductQuery";
import { useInfiniteScroll } from "@/apps/web-seller/common/hooks/useInfiniteScroll";
import { ProductList } from "@/apps/web-seller/features/product/components/list/ProductList";
import { SortBy, IProductItem } from "@/apps/web-seller/features/product/types/product.type";
import { flattenAndDeduplicateInfiniteData } from "@/apps/web-seller/common/utils/pagination.util";

export const StoreDetailProductListPage: React.FC = () => {
  const { storeId } = useParams();
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.LATEST);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  if (!storeId) {
    return (
      <div>
        <h2 className="text-xl font-semibold">스토어가 선택되지 않았습니다.</h2>
      </div>
    );
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useProductList({
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
  const products = flattenAndDeduplicateInfiniteData<IProductItem>(data);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">상품 목록</h1>
      </div>

      {/* 정렬 및 통계 */}
      <div className="flex items-center justify-between rounded-lg border bg-card p-4">
        <div className="text-sm text-muted-foreground">
          총 <span className="font-semibold text-foreground">{products.length || 0}</span>개의 상품
        </div>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SortBy.LATEST}>최신순</SelectItem>
            <SelectItem value={SortBy.POPULAR}>인기순</SelectItem>
            <SelectItem value={SortBy.PRICE_ASC}>가격 낮은순</SelectItem>
            <SelectItem value={SortBy.PRICE_DESC}>가격 높은순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 상품 목록 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">상품을 불러오는 중...</div>
        </div>
      ) : (
        <>
          <ProductList products={products} />

          {/* 무한 스크롤 트리거 */}
          {hasNextPage && (
            <div ref={loadMoreRef} className="flex min-h-[100px] items-center justify-center py-8">
              {isFetchingNextPage && (
                <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span>더 많은 상품을 불러오는 중...</span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
