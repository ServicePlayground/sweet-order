import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { productApi } from "@/apps/web-seller/features/product/apis/product.api";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import { ICreateProductRequest } from "@/apps/web-seller/features/product/types/product.type";
import { PRODUCT_SUCCESS_MESSAGES } from "@/apps/web-seller/features/product/constants/product.constant";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";

// 상품 등록 뮤테이션
export function useCreateProduct() {
  const { addAlert } = useAlertStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (request: ICreateProductRequest) => productApi.createProduct(request),
    onSuccess: (response, variables) => {
      addAlert({
        severity: "success",
        message: PRODUCT_SUCCESS_MESSAGES.PRODUCT_CREATED,
      });
      navigate(ROUTES.STORE_DETAIL_PRODUCTS_LIST(variables.storeId));
    },
    onError: (error) => {
      addAlert({
        severity: "error",
        message: getApiMessage.error(error),
      });
    },
  });
}

