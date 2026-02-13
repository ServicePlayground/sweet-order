"use client";

import Image from "next/image";
import { Product } from "@/apps/web-user/features/product/types/product.type";

interface CakeListSliderProps {
  title: string;
  products: Product[];
  isLoading: boolean;
  onProductClick: (productId: string) => void;
}

export default function CakeListSlider({
  title,
  products,
  isLoading,
  onProductClick,
}: CakeListSliderProps) {
  return (
    <div className="mb-[60px]">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      {isLoading ? (
        <div className="flex justify-center items-center p-10 text-gray-500 text-sm">
          <div className="loading-spinner-small" />
          <span className="ml-3">상품을 불러오는 중...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center p-10 text-gray-500 text-sm">
          등록된 상품이 없습니다.
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => onProductClick(product.id)}
              className="min-w-[200px] bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="w-full aspect-square relative bg-gray-50 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="200px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-semibold">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="text-base font-semibold text-gray-900 mb-2 leading-tight line-clamp-2 min-h-[44px]">
                  {product.name}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {product.salePrice.toLocaleString()}원
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
