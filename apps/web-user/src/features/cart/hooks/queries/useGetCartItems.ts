import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { cartApi } from "@/apps/web-user/features/cart/apis/cart.api";
import { cartQueryKeys } from "@/apps/web-user/features/cart/constants/cartQueryKeys.constant";
import { CartListResponse } from "@/apps/web-user/features/cart/types/cart.type";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
// import { useAuthStore } from "@/apps/web-user/features/auth/store/auth.store";

export function useGetCartItems() {
  const { showAlert } = useAlertStore();
  // const { isAuthenticated, isInitialized } = useAuthStore();

  const query = useQuery<CartListResponse>({
    queryKey: cartQueryKeys.list(),
    queryFn: () => cartApi.getCartItems(),
    enabled: false, // 장바구니 API가 백엔드에서 제거되어 비활성화
    // enabled: isInitialized && isAuthenticated, // 로그인한 사용자에게만 쿼리 실행
  });

  // 에러 alert 비활성화 (장바구니 API 제거로 인한 에러 방지)
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
