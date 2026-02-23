"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Product } from "@/apps/web-user/features/product/types/product.type";
import { Icon } from "../icons";
import { useAddProductLike } from "@/apps/web-user/features/like/hooks/mutations/useAddProductLike";
import { useRemoveProductLike } from "@/apps/web-user/features/like/hooks/mutations/useRemoveProductLike";
import { formatAddress } from "@/apps/web-user/common/utils/address.util";

interface CakeListSliderProps {
  title: string;
  products: Product[];
  isLoading: boolean;
  onProductClick: (productId: string) => void;
}

interface CakeListItemProps {
  product: Product;
  onCardClick: (productId: string) => void;
}

function CakeListItem({ product, onCardClick }: CakeListItemProps) {
  const [isLiked, setIsLiked] = useState(product.isLiked ?? false);

  const { mutate: addLike, isPending: isAddingLike } = useAddProductLike();
  const { mutate: removeLike, isPending: isRemovingLike } = useRemoveProductLike();
  const isLikeLoading = isAddingLike || isRemovingLike;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLikeLoading) return;
    setIsLiked(!isLiked);
    if (isLiked) {
      removeLike(product.id, { onError: () => setIsLiked(true) });
    } else {
      addLike(product.id, { onError: () => setIsLiked(false) });
    }
  };

  return (
    <div
      onClick={() => onCardClick(product.id)}
      className="min-w-[164px] bg-white"
    >
      <div className="w-full aspect-square relative overflow-hidden rounded-xl">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="164px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-semibold">
            No Image
          </div>
        )}
        <button
          type="button"
          onClick={handleLikeClick}
          disabled={isLikeLoading}
          className={`absolute bottom-3 right-3 h-[28px] w-[28px] ${isLikeLoading ? "opacity-50" : ""}`}
        >
          <Icon
            name={isLiked ? "favoriteShadowFilled" : "favoriteShadow"}
            width={28}
            height={28}
            className={isLiked ? "text-primary" : "text-white"}
          />
        </button>
      </div>
      <div className="mb-[10px] pt-2">
        <div className="mb-[2px] text-sm text-gray-900">
          <p>{product.name}</p>
          <p className="font-bold">{product.salePrice.toLocaleString()}원~</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-[2px] text-gray-900 font-bold">
            <Icon name="star" width={16} height={16} className="text-yellow-400" />
            {product.averageRating}
          </span>
          <span 
            className="relative text-gray-500 after:content-[''] after:absolute after:top-1/2 after:left-[-8px] after:w-[1px] after:h-[8px] after:bg-gray-300 after:transform after:translate-y-[-50%]"
          >
            {product.totalReviewCount}개 후기
          </span>
        </div>
      </div>
      <div
        className="inline-flex items-center gap-1 py-1 px-2 text-2xs font-bold text-gray-700 bg-gray-50 rounded-full max-w-full"
      >
        <span>{formatAddress(product.productNoticeAddress)} · {product.productNoticeProducer.length > 10 ? `${product.productNoticeProducer.slice(0, 10)}...` : product.productNoticeProducer}</span>
        <Icon name="arrow" width={16} height={16} className="text-gray-700 rotate-90" />
        </div>
      </div>
    );
}

export default function CakeListSlider({
  title,
  products,
  isLoading,
  onProductClick,
}: CakeListSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ isDown: false, hasDragged: false, startX: 0, scrollLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    drag.current.isDown = true;
    drag.current.hasDragged = false;
    drag.current.startX = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    drag.current.scrollLeft = scrollRef.current?.scrollLeft ?? 0;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drag.current.isDown) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    const walk = x - drag.current.startX;
    if (Math.abs(walk) > 5) drag.current.hasDragged = true;
    if (scrollRef.current) scrollRef.current.scrollLeft = drag.current.scrollLeft - walk;
  };

  const handleMouseUp = () => {
    drag.current.isDown = false;
    setIsDragging(false);
  };

  const handleCardClick = (productId: string) => {
    if (drag.current.hasDragged) return;
    onProductClick(productId);
  };

  return (
    <div className="pb-9">
      <h2 className="px-[20px] py-[10px] text-xl font-bold text-gray-900 mb-6">{title}</h2>
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
        <div
          ref={scrollRef}
          className={`flex gap-[8px] overflow-x-auto scrollbar-hide pl-[20px] select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {products.map((product) => (
            <CakeListItem
              key={product.id}
              product={product}
              onCardClick={handleCardClick}
            />
          ))}
          <div className="min-w-[12px] shrink-0" />
        </div>
      )}
    </div>
  );
}
