"use client";

import { StoreInfo } from "@/apps/web-user/features/store/types/store.type";
import { MapStoreCardContent } from "./MapStoreCard";
import { Icon } from "@/apps/web-user/common/components/icons";

interface MapStoreListSectionProps {
  stores: StoreInfo[];
  /** true면 상단 드래그 핸들 숨김 (지도 페이지 인라인 드래그 패널에서 사용) */
  hideHandle?: boolean;
  /** true면 정렬/필터 행 숨김 (지도 목록 영역에서 리스트만 표시) */
  hideSortFilter?: boolean;
  /** 목록 내 모든 카드가 동일한 기준으로 거리 표시 (지도 페이지에서 한 번만 조회한 위치) */
  userLocation?: { latitude: number; longitude: number } | null;
}

/** 지도 바텀 시트용 스토어 목록 (옵션에 따라 핸들/정렬·필터/리스트) */
export function MapStoreListSection({
  stores,
  hideHandle,
  hideSortFilter,
  userLocation,
}: MapStoreListSectionProps) {
  return (
    <div className="flex flex-col">
      {!hideHandle && (
        <div className="flex justify-center pt-3 pb-1">
          <div
            className="rounded-full bg-gray-200 shrink-0"
            style={{ width: 40, height: 4 }}
            aria-hidden
          />
        </div>
      )}

      {!hideSortFilter && (
        <div
          className={`flex items-center justify-between px-4 pb-3 border-b border-gray-100 ${hideHandle ? "pt-2" : ""}`}
        >
          <button
            type="button"
            className="flex items-center gap-1 text-gray-900 font-bold"
            style={{ fontSize: 14, lineHeight: "140%" }}
          >
            거리순
            <Icon name="selectArrow" width={16} height={16} className="rotate-180 shrink-0" />
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-100"
            aria-label="필터"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-700"
            >
              <circle cx="4" cy="5" r="1.5" fill="currentColor" />
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              <circle cx="16" cy="15" r="1.5" fill="currentColor" />
              <line x1="4" y1="5" x2="10" y2="10" stroke="currentColor" strokeWidth="1" />
              <line x1="10" y1="10" x2="16" y2="15" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
        </div>
      )}

      {/* 스토어 목록: 바깥 padding 12 20 12 12, item 패딩 없음 */}
      <ul className="flex flex-col gap-7" style={{ padding: "12px 20px 12px 12px" }}>
        {stores.length === 0 ? (
          <li className="py-10 text-center text-sm text-gray-400">
            이 지도 범위에 스토어가 없습니다.
          </li>
        ) : (
          stores.map((store) => (
            <li key={store.id}>
              <MapStoreCardContent
                store={store}
                userLocation={userLocation ?? null}
                variant="list"
                imageWidth={120}
                imageHeight={90}
                imageGap={4}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
