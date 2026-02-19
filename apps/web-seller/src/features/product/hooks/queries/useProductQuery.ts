import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { productApi } from "@/apps/web-seller/features/product/apis/product.api";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import { productQueryKeys } from "@/apps/web-seller/features/product/constants/productQueryKeys.constant";
import {
  ProductListResponse,
  IGetProductsListParams,
  SortBy,
} from "@/apps/web-seller/features/product/types/product.type";

// 상품 상세 조회 쿼리
export function useProductDetail(productId: string) {
  const { addAlert } = useAlertStore();

  const query = useQuery({
    queryKey: productQueryKeys.detail(productId),
    queryFn: () => productApi.getProductDetail(productId),
    enabled: !!productId,
  });

  useEffect(() => {
    if (query.isError) {
      addAlert({
        severity: "error",
        message: getApiMessage.error(query.error),
      });
    }
  }, [query.isError, query.error, addAlert]);

  return query;
}

export function useProductList({
  limit = 30,
  sortBy = SortBy.LATEST,
  storeId,
  search,
}: Partial<IGetProductsListParams> & { storeId: string }) {
  const { addAlert } = useAlertStore();

  const query = useInfiniteQuery<ProductListResponse>({
    queryKey: productQueryKeys.list({
      limit,
      sortBy,
      storeId,
      search,
    }),
    queryFn: ({ pageParam = 1 }) => {
      const params: IGetProductsListParams = {
        page: pageParam as number,
        limit,
        sortBy,
        storeId,
      };
      if (search) {
        params.search = search;
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
      addAlert({
        severity: "error",
        message: getApiMessage.error(query.error),
      });
    }
  }, [query.isError, query.error, addAlert]);

  return query;
}
