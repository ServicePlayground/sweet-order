"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Icon } from "@/apps/web-user/common/components/icons";
import { StoreInfo } from "@/apps/web-user/features/store/types/store.type";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { useUserLocation } from "@/apps/web-user/common/hooks/useUserLocation";
import { calculateDistance, formatDistance } from "@/apps/web-user/common/utils/distance.util";
import { useAddStoreLike } from "@/apps/web-user/features/like/hooks/mutations/useAddStoreLike";
import { useRemoveStoreLike } from "@/apps/web-user/features/like/hooks/mutations/useRemoveStoreLike";
import { useQueryClient } from "@tanstack/react-query";

interface MapStoreCardProps {
  store: StoreInfo;
}

export function MapStoreCard({ store }: MapStoreCardProps) {
  const [isLiked, setIsLiked] = useState(store.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(store.likeCount);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsLiked(store.isLiked ?? false);
    setLikeCount(store.likeCount);
  }, [store.id, store.isLiked, store.likeCount]);
  const { mutate: addLike, isPending: isAddingLike } = useAddStoreLike();
  const { mutate: removeLike, isPending: isRemovingLike } = useRemoveStoreLike();
  const isLikeLoading = isAddingLike || isRemovingLike;

  const { location: userLocation } = useUserLocation();
  const distance =
    userLocation !== null
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          store.latitude,
          store.longitude,
        )
      : null;

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLikeLoading) return;
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikeCount((prev) => (nextLiked ? prev + 1 : prev - 1));
    const onSuccess = () => queryClient.invalidateQueries({ queryKey: ["store", "list"] });
    const onError = () => {
      setIsLiked(!nextLiked);
      setLikeCount(store.likeCount);
    };
    if (isLiked) {
      removeLike(store.id, { onSuccess, onError });
    } else {
      addLike(store.id, { onSuccess, onError });
    }
  };

  const productImages = store.productRepresentativeImageUrls ?? [];

  return (
    <Link
      href={PATHS.STORE.DETAIL(store.id)}
      className="block overflow-hidden"
      style={{
        boxShadow: "0px 4px 16px 0px #00000029",
        background: "#FFFFFF",
        borderRadius: 16,
        padding: "12px 12px 16px 12px",
      }}
    >
      {/* 상품 대표이미지 캐러셀 */}
      {productImages.length > 0 && (
        <div
          className="flex overflow-x-auto scrollbar-hide"
          style={{ scrollSnapType: "x mandatory", gap: 6, marginBottom: 14 }}
        >
          {productImages.map((url, index) => (
            <div
              key={`${store.id}-img-${index}`}
              className="flex-shrink-0 overflow-hidden bg-gray-100"
              style={{ scrollSnapAlign: "start", width: 134, height: 100, borderRadius: 10 }}
            >
              <Image
                src={url}
                alt={`${store.name} 상품 ${index + 1}`}
                width={134}
                height={100}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}

      {/* 스토어 정보 */}
      <div>
        {productImages.length === 0 && <div className="pt-2" />}
        <div className="flex items-center justify-between gap-2">
          <h3
            className="font-bold truncate flex-1 min-w-0 text-gray-900"
            style={{ fontSize: 16, lineHeight: "140%", marginBottom: 6 }}
          >
            {store.name}
          </h3>
          <button
            type="button"
            onClick={handleLikeToggle}
            disabled={isLikeLoading}
            className={`flex items-center justify-center shrink-0 bg-white border border-gray-100 ${isLikeLoading ? "opacity-50" : ""}`}
            style={{ minWidth: 63, height: 32, borderRadius: 8, gap: 4 }}
          >
            <Icon
              name={isLiked ? "favoriteFilled" : "favorite"}
              width={18}
              height={18}
              className={`shrink-0 ${isLiked ? "text-primary" : "text-gray-900"}`}
            />
            <span className="font-bold text-gray-900" style={{ fontSize: 14, lineHeight: "140%" }}>
              {likeCount}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <Icon name="star" width={16} height={16} className="text-yellow-400 shrink-0" />
          <span className="font-normal text-gray-700" style={{ fontSize: 13, lineHeight: "140%" }}>
            {store.averageRating}
          </span>
          <span
            className="relative ml-4 font-normal text-gray-700 after:content-[''] after:absolute after:top-1/2 after:left-[-8px] after:w-[1px] after:h-[8px] after:bg-gray-500 after:transform after:translate-y-[-50%]"
            style={{ fontSize: 13, lineHeight: "140%" }}
          >
            후기 {store.totalReviewCount}개
          </span>
        </div>

        {(distance !== null || store.minProductPrice != null) && (
          <div className="flex items-center gap-1">
            {distance !== null && (
              <>
                <span
                  className="font-normal text-gray-700"
                  style={{ fontSize: 13, lineHeight: "140%" }}
                >
                  {formatDistance(distance)}
                </span>
                <span
                  className="font-normal text-gray-700"
                  style={{ fontSize: 13, lineHeight: "140%" }}
                >
                  ·
                </span>
              </>
            )}
            {store.minProductPrice != null && (
              <span
                className="font-bold text-gray-900"
                style={{ fontSize: 13, lineHeight: "140%" }}
              >
                {store.minProductPrice.toLocaleString()}원~
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
