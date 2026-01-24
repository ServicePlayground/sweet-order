"use client";

import { Product } from "@/apps/web-user/features/product/types/product.type";
import { useEffect } from "react";

interface ProductDetailInfoSectionProps {
  product: Product;
}

export function ProductDetailInfoSection({ product }: ProductDetailInfoSectionProps) {

  return (
    <div className="flex flex-col gap-6 px-[20px] pt-[16px] pb-[34px]">
      <div>
        {/* 판매자명, 상품명, 가격 */}
        <div className="inline-flex items-center gap-[4px] mb-[8px] px-[6px] py-[6px] rounded-full bg-[#F6F5F5] text-xs text-gray-900 font-bold">
          <span className="w-[14px] h-[14px] rounded-full bg-primary"></span>
          {product.productNoticeProducer}
        </div>
        <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 line-through">40,000원</span>
          <p className="flex items-center gap-[4px] text-xl font-bold text-gray-900">
            <span className="text-[#FF653E]">50%</span>
            {product.salePrice.toLocaleString()}원~
          </p>
        </div>
      </div>

      {/* 주문 폼 */}
      {/* <ProductDetailOrderFormSection product={product} /> */}
    </div>
  );
}
