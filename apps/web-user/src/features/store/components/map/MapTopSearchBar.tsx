"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/apps/web-user/common/components/icons";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";

interface MapTopSearchBarProps {
  /** 검색어가 있으면 뒤로가기+검색어+닫기 UI, 없으면 플레이스홀더 버튼 */
  searchQuery: string | null;
}

export function MapTopSearchBar({ searchQuery }: MapTopSearchBarProps) {
  const router = useRouter();

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
        <button
          type="button"
          onClick={() => router.push(PATHS.MAP_SEARCH)}
          className="w-full text-left"
        >
          <div
            className="flex w-full items-center gap-2 bg-white font-normal"
            style={{
              borderRadius: 999,
              padding: "10px 16px",
              border: "1px solid var(--grayscale-gr-100, #EBEBEA)",
              boxShadow: "0px 2px 10px 0px #0000000A",
            }}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
              <Icon name="search" width={20} height={20} className="text-gray-800 block" />
            </span>
            <span
              className="flex flex-1 items-center text-left leading-[1.4] pt-0.5"
              style={{
                fontSize: 14,
                color: "var(--grayscale-gr-500, #82817D)",
              }}
            >
              어떤 케이크를 찾으시나요?
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
