"use client";

import { BottomSheet } from "@/apps/web-user/common/components/bottom-sheets/BottomSheet";
import { BottomSheetOptionList } from "./BottomSheetOptionList";

interface NavigationBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  storeName: string;
}

function openKakaoNavigation(lat: number, lng: number, name: string) {
  const encodedName = encodeURIComponent(name);
  window.open(`https://map.kakao.com/link/to/${encodedName},${lat},${lng}`, "_blank");
}

function openNaverNavigation(lat: number, lng: number, name: string) {
  const encodedName = encodeURIComponent(name);
  window.open(
    `https://map.naver.com/p/directions/-/${lng},${lat},${encodedName},,PLACE_POI/-/transit`,
    "_blank",
  );
}

export function NavigationBottomSheet({
  isOpen,
  onClose,
  latitude,
  longitude,
  storeName,
}: NavigationBottomSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="길찾기"
      footerShadow={false}
      footer={
        <div className="px-5 py-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-[52px] rounded-xl border border-gray-100 text-base font-bold text-gray-900"
          >
            취소
          </button>
        </div>
      }
    >
      <BottomSheetOptionList
        items={[
          {
            icon: { type: "image", src: "/images/contents/map_naver.png", alt: "네이버 지도" },
            label: "네이버 지도",
            onClick: () => {
              openNaverNavigation(latitude, longitude, storeName);
              onClose();
            },
          },
          {
            icon: { type: "image", src: "/images/contents/map_kakao.png", alt: "카카오 지도" },
            label: "카카오 지도",
            onClick: () => {
              openKakaoNavigation(latitude, longitude, storeName);
              onClose();
            },
          },
        ]}
      />
    </BottomSheet>
  );
}
