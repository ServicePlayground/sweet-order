"use client";

import Image from "next/image";

interface ProductDetailImageGallerySectionProps {
  images: string;
  productName: string;
}

export function ProductDetailImageGallerySection({
  images,
  productName,
}: ProductDetailImageGallerySectionProps) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[280px] aspect-square bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
        이미지가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 메인 이미지 */}
      <div className="w-full h-[280px] aspect-square relative overflow-hidden ">
        <Image
          src={images}
          alt={`${productName} - 이미지`}
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>
    </div>
  );
}
