"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/apps/web-user/common/components/search/SearchBar";
import {
  ProductFilterModal,
  ProductFilters,
} from "@/apps/web-user/features/product/components/modals/ProductFilterModal";
import { SearchProductListSection } from "@/apps/web-user/features/product/components/sections/SearchProductListSection";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchParams.get("q") || "");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({});
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 검색어가 변경되면 URL 업데이트 (검색 버튼 클릭 시)
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setDebouncedSearchTerm(term);
    if (term.trim()) {
      router.push(`/search?q=${encodeURIComponent(term.trim())}`);
    } else {
      router.push(`/search`);
    }
  };

  const handleFilterApply = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  // URL 쿼리 파라미터에서 검색어 가져오기
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchTerm(q);
      setDebouncedSearchTerm(q);
    }
  }, [searchParams]);

  // 검색어 디바운싱 (실시간 검색)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      // URL 업데이트
      if (searchTerm.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`, { scroll: false });
      } else {
        router.push(`/search`, { scroll: false });
      }
    }, 300); // 300ms 디바운스

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, router]);

  return (
    <div
      style={{
        margin: "0 auto",
        padding: "24px 20px",
        width: "100%",
      }}
    >
      {/* 검색 바 및 필터 */}
      <div
        style={{
          marginBottom: "50px",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ flex: 1 }}>
            <SearchBar
              initialValue={searchTerm}
              onSearch={handleSearch}
              onChange={setSearchTerm}
              placeholder="상품을 검색해보세요"
            />
          </div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            style={{
              height: "48px",
              padding: "0 24px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
              color: "#374151",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            필터
          </button>
        </div>
      </div>

      {/* 상품 목록 */}
      <SearchProductListSection search={debouncedSearchTerm} filters={filters} />

      {/* 필터 모달 */}
      <ProductFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleFilterApply}
        initialFilters={filters}
      />
    </div>
  );
}
