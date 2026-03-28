"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchProductListSection } from "@/apps/web-user/features/product/components/sections/SearchProductListSection";
import { SearchStoreListSection } from "@/apps/web-user/features/store/components/sections/SearchStoreListSection";
import { Icon } from "@/apps/web-user/common/components/icons";
import { SearchFilterSheet, type SearchSortBy } from "@/apps/web-user/features/search/components/SearchFilterSheet";
import type { StoreListFilter } from "@/apps/web-user/features/store/types/store.type";

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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [submittedTerm, setSubmittedTerm] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState<"product" | "store">("product");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [listFilter, setListFilter] = useState<StoreListFilter>({});
  const [sortBy, setSortBy] = useState<SearchSortBy>("distance");

  useEffect(() => {
    const q = searchParams.get("q");
    setSearchTerm(q || "");
  }, [searchParams]);

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    saveRecentSearch(term.trim());
    setSearchTerm(term.trim());
    setSubmittedTerm(term.trim());
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const isSearching = !!submittedTerm.trim();

  return (
    <div className="w-full">
      {/* 검색 입력 */}
      <div className="flex items-center px-5 h-[52px] border-b border-gray-100">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
          <Icon name="search" width={20} height={20} className="text-gray-800 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
            placeholder="어떤 케이크를 찾으시나요?"
            className="flex-1 text-sm text-gray-900 outline-none placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden"
          />
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm("")} className="w-5 h-5">
              <Icon name="closeCircle" width={20} height={20} className="text-gray-300" />
            </button>
          )}
        </form>
      </div>

      {/* 탭 + 검색 결과 */}
      {isSearching && (
        <>
          <div className="flex items-center gap-[24px] py-[16px] px-[20px]">
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center justify-center w-[36px] h-[36px] shrink-0 border border-gray-100 rounded-full"
            >
              <Icon name="sort" width={20} height={20} className="text-gray-500" />
            </button>
            <div className="flex flex-1 items-center gap-[12px] py-[16px]">
              {[
                { key: "product", label: "상품" },
                { key: "store", label: "스토어" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as "product" | "store")}
                  className={`flex-1 h-[36px] text-sm border rounded-full ${
                    activeTab === key
                      ? "text-primary bg-primary-50 border-primary-100"
                      : "text-gray-400 bg-white border-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="px-5">
            {activeTab === "product" ? (
              <SearchProductListSection
                search={submittedTerm}
                minPrice={listFilter.minPrice}
                maxPrice={listFilter.maxPrice}
                productCategoryTypes={listFilter.productCategoryTypes}
                sortBy={sortBy}
              />
            ) : (
              <SearchStoreListSection search={submittedTerm} filter={listFilter} sortBy={sortBy} />
            )}
          </div>
        </>
      )}

      <SearchFilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filter={listFilter}
        onFilterChange={setListFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />
    </div>
  );
}
