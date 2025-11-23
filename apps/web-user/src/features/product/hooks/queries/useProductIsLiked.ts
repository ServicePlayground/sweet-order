import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/apps/web-user/features/product/apis/product.api";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import { productQueryKeys } from "@/apps/web-user/features/product/constants/productQueryKeys.constant";
import { ProductIsLiked } from "@/apps/web-user/features/product/types/product.type";

/**
 * 상품 좋아요 여부 조회 훅
 * @param productId 상품 ID
 */
export function useProductIsLiked(productId: string) {
  const { showAlert } = useAlertStore();

  const query = useQuery<ProductIsLiked>({
    queryKey: productQueryKeys.isLiked(productId),
    queryFn: () => productApi.getProductIsLiked(productId),
    enabled: !!productId,
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
