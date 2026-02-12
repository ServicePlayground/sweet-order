"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Icon } from "@/apps/web-user/common/components/icons";
import { StoreInfo } from "@/apps/web-user/features/store/types/store.type";
import { useAddStoreLike } from "@/apps/web-user/features/like/hooks/mutations/useAddStoreLike";
import { useRemoveStoreLike } from "@/apps/web-user/features/like/hooks/mutations/useRemoveStoreLike";
import { isWebViewEnvironment } from "@/apps/web-user/common/utils/webview.bridge";

// 위치 브릿지 타입 확장
declare global {
  interface Window {
    mylocation?: {
      postMessage: (message: string) => void;
    };
    receiveLocation?: (latitude: number, longitude: number) => void;
  }
}

// Haversine 공식으로 두 좌표 간 거리 계산 (km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface StoreDetailIntroSectionProps {
  store: StoreInfo;
}

export function StoreDetailIntroSection({ store }: StoreDetailIntroSectionProps) {
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(store.isLiked ?? false);

  const { mutate: addLike, isPending: isAddingLike } = useAddStoreLike();
  const { mutate: removeLike, isPending: isRemovingLike } = useRemoveStoreLike();
  const isLikeLoading = isAddingLike || isRemovingLike;

  // 좌표로 거리 계산
  const calculateAndSetDistance = useCallback((latitude: number, longitude: number) => {
    const dist = calculateDistance(
      latitude,
      longitude,
      store.latitude,
      store.longitude
    );
    setDistance(dist);
  }, [store.latitude, store.longitude]);

  // 현재 위치 가져오기 및 거리 계산
  useEffect(() => {
    // 앱 웹뷰 환경인 경우 - 브릿지 사용
    if (isWebViewEnvironment()) {
      window.receiveLocation = (latitude: number, longitude: number) => {
        calculateAndSetDistance(latitude, longitude);
      };

      // 앱에 위치 요청
      if (window.mylocation) {
        window.mylocation.postMessage("true");
      }

      return;
    }

    // 웹 브라우저 환경인 경우 - Geolocation API 사용
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        calculateAndSetDistance(position.coords.latitude, position.coords.longitude);
      },
      () => {
        // 위치 권한 거부 시 거리 표시 안함
        setDistance(null);
      }
    );
  }, [calculateAndSetDistance]);

  const handleLikeToggle = () => {
    if (isLikeLoading) return;
    setIsLiked(!isLiked);
    if (isLiked) {
      removeLike(store.id, { onError: () => setIsLiked(true) });
    } else {
      addLike(store.id, { onError: () => setIsLiked(false) });
    }
  };

  // 거리 포맷팅 (1km 미만이면 m 단위로 표시)
  const formatDistance = (km: number): string => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  };

  // 설명 텍스트 줄임 처리
  const maxLength = 60;
  const shouldTruncate = store.description && store.description.length > maxLength;
  const displayDescription = isExpanded || !shouldTruncate
    ? store.description
    : `${store.description?.slice(0, maxLength)}...`;

  return (
    <div className="py-6">
      {/* 상단 영역: 로고 + 정보 + 좋아요 */}
      <div className="flex items-center gap-[11px] mb-[16px]">
        {/* 로고 이미지 */}
        {store.logoImageUrl && !imageError ? (
          <div className="w-12 h-12 relative rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={store.logoImageUrl}
              alt={`${store.name} 로고`}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              unoptimized
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs flex-shrink-0">
            No Image
          </div>
        )}

        {/* 스토어 정보 */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900">{store.name}</h1>
          <div className="flex items-center">
            <Icon name="star" width={16} height={16} className="text-yellow-400" />
            <span className="ml-[2px] text-xs text-gray-500 font-bold">{store.averageRating}</span>
            <span className="relative ml-[16px] text-xs text-gray-500 font-bold after:content-[''] after:absolute after:top-1/2 after:left-[-8px] after:w-[1px] after:h-[8px] after:bg-gray-500 after:transform after:translate-y-[-50%]">후기 {store.totalReviewCount}개</span>
          </div>
        </div>

        {/* 좋아요 버튼 */}
        <button
          type="button"
          onClick={handleLikeToggle}
          disabled={isLikeLoading}
          className={`flex items-center gap-1 px-[8px] py-[6px] border border-gray-100 rounded-md ${isLikeLoading ? "opacity-50" : ""}`}
        >
          <Icon
            name={isLiked ? "favoriteFilled" : "favorite"}
            width={18}
            height={18}
            className={isLiked ? "text-primary" : "text-gray-900"}
          />
          <span className="text-sm font-bold text-gray-900">{store.likeCount}</span>
        </button>
      </div>

      {/* 위치 정보 */}
      <div className="flex items-center gap-1 mb-[10px]">
        <Icon name="location" width={16} height={16} className="text-primary-300" />
        {distance !== null && (
          <>
            <span className="text-sm text-gray-900">{formatDistance(distance)}</span>
            <span className="text-sm text-gray-900">·</span>
          </>
        )}
        <span className="text-sm text-gray-900">{store.roadAddress}</span>
      </div>

      {/* 설명 */}
      {store.description && (
        <div className="px-[16px] py-[12px] bg-gray-50 rounded-lg">
          <p className="text-2sm text-gray-900 leading-relaxed">
            {displayDescription}
            {shouldTruncate && !isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-gray-400 ml-1 hover:text-gray-600"
              >
                더보기
              </button>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
