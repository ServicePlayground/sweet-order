"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SearchBar } from "@/apps/web-user/common/components/search/SearchBar";
import { useAuthStore } from "@/apps/web-user/common/store/auth.store";
import { useProductList } from "@/apps/web-user/features/product/hooks/queries/useProductList";
import { SortBy, Product } from "@/apps/web-user/features/product/types/product.type";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";

export default function Home() {
  const { isAuthenticated, accessToken } = useAuthStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // 신규케이크 (최신순) - 10개만
  const { data: latestData, isLoading: isLatestLoading } = useProductList({
    sortBy: SortBy.LATEST,
    limit: 10,
  });

  // 인기케이크 (인기순) - 10개만
  const { data: popularData, isLoading: isPopularLoading } = useProductList({
    sortBy: SortBy.POPULAR,
    limit: 10,
  });

  // 검색 기능
  const handleSearch = (searchValue: string) => {
    if (searchValue.trim()) {
      router.push(`${PATHS.SEARCH}?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  // 상품 목록 (첫 번째 페이지의 data만 사용, 최대 10개)
  const latestProducts: Product[] = latestData?.pages?.[0]?.data?.slice(0, 10) || [];
  const popularProducts: Product[] = popularData?.pages?.[0]?.data?.slice(0, 10) || [];

  // 상품 클릭 핸들러
  const handleProductClick = (productId: string) => {
    router.push(PATHS.PRODUCT.DETAIL(productId));
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "40px 20px",
      }}
    >
      {/* 검색 바 */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          justifyContent: "center",
          marginBottom: "40px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "100%" }}>
          <SearchBar
            placeholder="상품을 검색해보세요"
            initialValue={searchTerm}
            onSearch={handleSearch}
            onChange={setSearchTerm}
          />
        </div>
      </div>

      {/* 신규케이크 (최신순) */}
      <div style={{ marginBottom: "60px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "24px",
          }}
        >
          신규케이크
        </h2>
        {isLatestLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            <div className="loading-spinner-small" />
            <span style={{ marginLeft: "12px" }}>상품을 불러오는 중...</span>
          </div>
        ) : latestProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            등록된 상품이 없습니다.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              paddingBottom: "8px",
              scrollbarWidth: "thin",
            }}
          >
            {latestProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                style={{
                  minWidth: "200px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                }}
              >
                {/* 상품 이미지 */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    position: "relative",
                    backgroundColor: "#f9fafb",
                    overflow: "hidden",
                  }}
                >
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="200px"
                      style={{ objectFit: "cover" }}
                      unoptimized
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#9ca3af",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      No Image
                    </div>
                  )}
                </div>

                {/* 상품 정보 */}
                <div style={{ padding: "16px" }}>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#111827",
                      marginBottom: "8px",
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: "44px",
                    }}
                  >
                    {product.name}
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {product.salePrice.toLocaleString()}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 인기케이크 (인기순) */}
      <div style={{ marginBottom: "60px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "24px",
          }}
        >
          인기케이크
        </h2>
        {isPopularLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            <div className="loading-spinner-small" />
            <span style={{ marginLeft: "12px" }}>상품을 불러오는 중...</span>
          </div>
        ) : popularProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            등록된 상품이 없습니다.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              paddingBottom: "8px",
              scrollbarWidth: "thin",
            }}
          >
            {popularProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                style={{
                  minWidth: "200px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                }}
              >
                {/* 상품 이미지 */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    position: "relative",
                    backgroundColor: "#f9fafb",
                    overflow: "hidden",
                  }}
                >
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="200px"
                      style={{ objectFit: "cover" }}
                      unoptimized
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#9ca3af",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      No Image
                    </div>
                  )}
                </div>

                {/* 상품 정보 */}
                <div style={{ padding: "16px" }}>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#111827",
                      marginBottom: "8px",
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: "44px",
                    }}
                  >
                    {product.name}
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {product.salePrice.toLocaleString()}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 로그인 상태 표시 (임시) */}
      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#f9fafb",
          borderRadius: "12px",
          textAlign: "center",
          fontSize: "14px",
          color: "#374151",
        }}
      >
        {isAuthenticated
          ? `✅ 로그인됨 토큰: ${accessToken ? `${accessToken.substring(0, 20)}...` : "없음"}`
          : "⚠️ 로그인 필요"}
      </div>
    </div>
  );
}
