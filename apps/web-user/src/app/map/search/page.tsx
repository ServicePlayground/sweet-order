"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Icon } from "@/apps/web-user/common/components/icons";
import { BottomNav } from "@/apps/web-user/common/components/navigation/BottomNav";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";

const RECENT_SEARCHES_KEY = "recentSearches";
const MAX_RECENT = 10;

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(term: string) {
  const prev = getRecentSearches().filter((t) => t !== term);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify([term, ...prev].slice(0, MAX_RECENT)));
}

export default function MapSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const q = searchParams.get("q");
    setSearchTerm(q || "");
  }, [searchParams]);

  // 진입 시 검색 인풋에 포커스
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    saveRecentSearch(term.trim());
    setSearchTerm(term.trim());
    router.push(`${PATHS.MAP}?q=${encodeURIComponent(term.trim())}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 헤더: space-between, padding 10 20, 아이콘 16x16 + 텍스트, 닫기 underline */}
      <header
        className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between bg-white max-w-[638px] mx-auto w-full"
        style={{
          padding: "10px 20px",
          background: "#FFFFFF",
        }}
      >
        <div className="flex items-center gap-1">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center">
            <Icon name="location" width={16} height={16} className="text-primary block" />
          </span>
          <span
            className="font-bold pt-0.5"
            style={{
              fontSize: 13,
              lineHeight: "140%",
              color: "var(--grayscale-gr-900, #1A1A1A)",
            }}
          >
            지도
          </span>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="font-bold underline py-1 px-0 border-0 bg-transparent cursor-pointer"
          style={{
            fontSize: 14,
            lineHeight: "140%",
            color: "var(--grayscale-gr-500, #82817D)",
            textDecoration: "underline",
            textDecorationStyle: "solid",
          }}
        >
          닫기
        </button>
      </header>

      {/* 검색 영역: padding 16 20, background #FFF, border-bottom gr-100 */}
      <div
        className="flex items-center"
        style={{
          padding: "16px 20px",
          background: "#FFFFFF",
          borderBottom: "1px solid var(--grayscale-gr-100, #EBEBEA)",
        }}
      >
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
          <Icon name="search" width={20} height={20} className="text-gray-800 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
            placeholder="어떤 케이크를 찾으시나요?"
            className="flex-1 text-sm text-gray-900 outline-none placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden"
          />
          {searchTerm.length > 0 && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="w-5 h-5 flex items-center justify-center shrink-0"
              aria-label="입력 지우기"
            >
              <Icon name="closeCircle" width={20} height={20} className="text-gray-300" />
            </button>
          )}
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
