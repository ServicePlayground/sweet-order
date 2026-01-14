"use client";

import { Product } from "@/apps/web-user/features/product/types/product.type";

interface ProductDetailInfoSectionProps {
  product: Product;
}

export function ProductDetailInfoSection({ product }: ProductDetailInfoSectionProps) {
  // 좋아요 여부 조회 (로그인 상태에서만 조회)

  return (
    <div className="flex flex-col gap-6 px-[20px] pt-[16px] pb-[34px]">
      <div>
        {/* 판매자명, 상품명, 가격 */}
        <div className="inline-flex items-center gap-[4px] mb-[8px] px-[6px] py-[6px] rounded-full bg-[#F6F5F5] text-xs text-gray-900 font-bold">
          <span
            className={`w-[14px] h-[14px] rounded-full ${
              product.letteringRequired === "REQUIRED" ? "bg-[#FF653E]" : "bg-gray-400"
            }`}
          ></span>
          {product.productNoticeProducer}
        </div>
        <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-xl font-bold text-gray-900">{product.salePrice.toLocaleString()}원~</p>
      </div>

      {/* 주문 폼 */}
      {/* <ProductDetailOrderFormSection product={product} /> */}
    </div>
  );
}
