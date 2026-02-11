import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { productApi } from "@/apps/web-user/features/product/apis/product.api";
import { productQueryKeys } from "@/apps/web-user/features/product/constants/productQueryKeys.constant";
import {
  ProductListResponse,
  GetProductsParams,
  ProductListQueryParams,
  SortBy,
} from "@/apps/web-user/features/product/types/product.type";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";

export function useProductList({
  limit = 30,
  sortBy = SortBy.POPULAR,
  storeId,
  search,
  minPrice,
  maxPrice,
  productType,
}: Partial<ProductListQueryParams> = {}) {
  const { showAlert } = useAlertStore();

  const query = useInfiniteQuery<ProductListResponse>({
    queryKey: productQueryKeys.list({
      limit,
      sortBy,
      storeId,
      search,
      minPrice,
      maxPrice,
      productType,
    }),
    queryFn: ({ pageParam = 1 }) => {
      const params: GetProductsParams = {
        page: pageParam as number,
        limit,
        sortBy,
      };
      if (storeId) {
        params.storeId = storeId;
      }
      if (search) {
        params.search = search;
      }
      if (minPrice !== undefined) {
        params.minPrice = minPrice;
      }
      if (maxPrice !== undefined) {
        params.maxPrice = maxPrice;
      }
      if (productType) {
        params.productType = productType;
      }
      return productApi.getProducts(params);
    },
    // 반환된 값은 다음 API 요청의 queryFn의 pageParam으로 전달됩니다.
    // 이 값은 hasNextPage에도 영향을 줍니다.
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasNext) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (query.isError) {
      showAlert({
        type: "error",
        title: "오류",
        message: getApiMessage.error(query.error),
      });
    }
  }, [query.isError, query.error, showAlert]);

  return query;
}
