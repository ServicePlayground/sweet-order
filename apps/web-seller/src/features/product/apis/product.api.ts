import { sellerClient } from "@/apps/web-seller/common/config/axios.config";
import {
  CreateProductRequestDto,
  CreateProductResponseDto,
  UpdateProductRequestDto,
  ProductListResponseDto,
  GetSellerProductsRequestDto,
  ProductResponseDto,
} from "@/apps/web-seller/features/product/types/product.dto";
import type { MessageResponseDto } from "@/apps/web-seller/common/types/api.dto";

export const productApi = {
  // 상품 등록
  createProduct: async (request: CreateProductRequestDto): Promise<CreateProductResponseDto> => {
    const response = await sellerClient.post("/products", request);
    return response.data.data;
  },
  // 판매자용 상품 목록 조회 (무한 스크롤)
  getProducts: async (params: GetSellerProductsRequestDto): Promise<ProductListResponseDto> => {
    const response = await sellerClient.get("/products", { params });
    return response.data.data;
  },
  // 판매자용 상품 상세 조회
  getProductDetail: async (productId: string): Promise<ProductResponseDto> => {
    const response = await sellerClient.get(`/products/${productId}`);
    return response.data.data;
  },
  // 판매자용 상품 수정
  updateProduct: async (
    productId: string,
    request: UpdateProductRequestDto,
  ): Promise<CreateProductResponseDto> => {
    const response = await sellerClient.put(`/products/${productId}`, request);
    return response.data.data;
  },
  // 판매자용 상품 삭제
  deleteProduct: async (productId: string): Promise<MessageResponseDto> => {
    const response = await sellerClient.delete(`/products/${productId}`);
    return response.data.data;
  },
};
