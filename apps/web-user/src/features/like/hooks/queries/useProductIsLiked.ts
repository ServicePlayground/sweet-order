import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { likeApi } from "@/apps/web-user/features/like/apis/like.api";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import { likeQueryKeys } from "@/apps/web-user/features/like/constants/likeQueryKeys.constant";
import { ProductIsLiked } from "@/apps/web-user/features/like/types/like.type";

/**
 * 상품 좋아요 여부 조회 훅
 * @param productId 상품 ID
 */
export function useProductIsLiked(productId: string) {
  const { showAlert } = useAlertStore();

  const query = useQuery<ProductIsLiked>({
    queryKey: likeQueryKeys.productIsLiked(productId),
    queryFn: () => likeApi.getProductIsLiked(productId),
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
