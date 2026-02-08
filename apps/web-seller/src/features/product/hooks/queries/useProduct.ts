import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { productApi } from "@/apps/web-seller/features/product/apis/product.api";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import {
  ICreateProductRequest,
  IUpdateProductRequest,
} from "@/apps/web-seller/features/product/types/product.type";
import { PRODUCT_SUCCESS_MESSAGES } from "@/apps/web-seller/features/product/constants/product.constant";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { productQueryKeys } from "@/apps/web-seller/features/product/constants/productQueryKeys.constant";

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
      // 상품 목록으로 이동
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

// 상품 수정 뮤테이션
export function useUpdateProduct() {
  const { addAlert } = useAlertStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      productId,
      request,
    }: {
      productId: string;
      request: IUpdateProductRequest;
      storeId: string;
    }) => productApi.updateProduct(productId, request),
    onSuccess: (response, variables) => {
      addAlert({
        severity: "success",
        message: PRODUCT_SUCCESS_MESSAGES.PRODUCT_UPDATED,
      });
      // 상품 목록으로 이동
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

// 상품 삭제 뮤테이션
export function useDeleteProduct() {
  const { addAlert } = useAlertStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ productId }: { productId: string; storeId: string }) =>
      productApi.deleteProduct(productId),
    onSuccess: (response, variables) => {
      addAlert({
        severity: "success",
        message: PRODUCT_SUCCESS_MESSAGES.PRODUCT_DELETED,
      });
      // 상품 목록으로 이동
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
