"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/apps/web-user/common/components/icons";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import {
  formatMapPickupFilterForSearchBar,
  type MapPickupFilter,
} from "@/apps/web-user/features/store/utils/map.util";

interface MapTopSearchBarProps {
  /** 검색어가 있으면 뒤로가기+검색어+닫기 UI, 없으면 플레이스홀더 버튼 */
  searchQuery: string | null;
  onCalendarClick?: () => void;
  pickupFilter?: MapPickupFilter | null;
  onPickupClear?: () => void;
}

function MapPickupFilterChip({
  filter,
  onClear,
}: {
  filter: MapPickupFilter;
  onClear: () => void;
}) {
  const { dateLine, periodLine } = formatMapPickupFilterForSearchBar(filter);

  const labelClass =
    "block w-full truncate text-[11px] font-bold leading-[14px] text-[var(--primary-or-400,#FF653E)]";

  return (
    <div
      className="box-border flex h-10 shrink-0 items-center"
      style={{
        borderRadius: 8,
        padding: "5px 8px",
        background: "var(--primary-or-50, #FFEFEB)",
        border: "1px solid var(--primary-or-100, #FFD2C7)",
        boxShadow: "0px 2px 10px 0px #0000000A",
        gap: 8,
      }}
    >
      <button
        type="button"
        onClick={onClear}
        className="flex min-h-0 min-w-0 flex-1 flex-col items-start justify-center gap-0 p-0 text-left"
        aria-label={`픽업 ${dateLine} ${periodLine} 필터 초기화`}
      >
        <span className={labelClass}>{dateLine}</span>
        <span className={labelClass}>{periodLine}</span>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClear();
        }}
        className="flex shrink-0 items-center justify-center p-0"
        aria-label="픽업 날짜 지우기"
      >
        <Icon name="close3" width={16} height={16} className="shrink-0 block" />
      </button>
    </div>
  );
}

export function MapTopSearchBar({
  searchQuery,
  onCalendarClick,
  pickupFilter,
  onPickupClear,
}: MapTopSearchBarProps) {
  const router = useRouter();

  const renderPickupSlot = () => {
    if (onCalendarClick == null) return null;
    if (pickupFilter != null) {
      return (
        <MapPickupFilterChip filter={pickupFilter} onClear={onPickupClear ?? (() => {})} />
      );
    }
    return (
      <button
        type="button"
        onClick={onCalendarClick}
        className="box-border flex h-10 w-10 shrink-0 items-center justify-center"
        style={{
          borderRadius: 26,
          border: "1px solid var(--grayscale-gr-100, #EBEBEA)",
          boxShadow: "0px 2px 10px 0px #0000000A",
          background: "#ffffff",
        }}
        aria-label="픽업 날짜 선택"
      >
        <Icon name="calendar" width={20} height={20} className="text-gray-500 block shrink-0" />
      </button>
    );
  };

  return (
    <div
      className={`absolute top-0 left-0 right-0 z-10 max-w-[638px] mx-auto ${!searchQuery ? "pt-4 px-4" : ""}`}
      style={
        searchQuery
          ? {
              padding: "16px 20px",
              background: "#FFFFFF",
              borderBottom: "1px solid var(--grayscale-gr-100, #EBEBEA)",
            }
          : undefined
      }
    >
      {searchQuery ? (
        <div className="flex w-full items-center gap-2" style={{ gap: 8 }}>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex shrink-0 items-center justify-center p-0"
            aria-label="뒤로 가기"
          >
            <Icon name="back" width={24} height={24} className="text-gray-900 block" />
          </button>
          <span
            className="flex-1 min-w-0 text-left font-normal truncate"
            style={{
              fontSize: 16,
              lineHeight: "140%",
              color: "var(--grayscale-gr-900, #1A1A1A)",
            }}
          >
            {searchQuery}
          </span>
          {renderPickupSlot()}
          <button
            type="button"
            onClick={() => router.push(PATHS.MAP)}
            className="flex shrink-0 items-center justify-center p-0"
            aria-label="검색 닫기"
          >
            <Icon name="closeCircle" width={20} height={20} className="text-gray-300" />
          </button>
        </div>
      ) : (
        <div className="flex w-full items-center gap-2" style={{ gap: 8 }}>
          <button
            type="button"
            onClick={() => router.push(PATHS.MAP_SEARCH)}
            className="min-w-0 flex-1 text-left"
          >
            <div
              className="box-border flex w-full items-center gap-2 bg-white font-normal"
              style={{
                height: 40,
                borderRadius: 999,
                padding: "0 16px",
                border: "1px solid var(--grayscale-gr-100, #EBEBEA)",
                boxShadow: "0px 2px 10px 0px #0000000A",
              }}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                <Icon name="search" width={20} height={20} className="text-gray-800 block" />
              </span>
              <span
                className="flex min-h-0 flex-1 items-center text-left"
                style={{
                  fontSize: 14,
                  lineHeight: "140%",
                  color: "var(--grayscale-gr-500, #82817D)",
                }}
              >
                어떤 케이크를 찾으시나요?
              </span>
            </div>
          </button>
          {renderPickupSlot()}
        </div>
      )}
    </div>
  );
}
