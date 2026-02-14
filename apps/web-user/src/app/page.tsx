"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SearchBar } from "@/apps/web-user/common/components/search/SearchBar";
import { useAuthStore } from "@/apps/web-user/common/store/auth.store";
import { useUserCurrentLocationStore } from "@/apps/web-user/common/store/user-current-location.store";
import { useProductList } from "@/apps/web-user/features/product/hooks/queries/useProductList";
import { SortBy, Product } from "@/apps/web-user/features/product/types/product.type";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import Link from "next/link";
import {
  navigateToLoginPage,
  logoutFromWebView,
  requestLocationFromWebView,
} from "@/apps/web-user/common/utils/webview.bridge";
import { useStoreDetail } from "@/apps/web-user/features/store/hooks/queries/useStoreDetail";

export default function Home() {
  const { isAuthenticated, accessToken } = useAuthStore();
  const { latitude, longitude } = useUserCurrentLocationStore();
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

  // 스토어 ID 추출 (QA용)
  const allProducts = [...latestProducts, ...popularProducts];
  const uniqueStoreIds = [...new Set(allProducts.map((p) => p.storeId).filter(Boolean))];

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

      {/* 스토어 목록 (QA용) */}
      {uniqueStoreIds.length > 0 && (
        <StoreListSection storeIds={uniqueStoreIds} />
      )}

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

      {/* 로그인/로그아웃 버튼 */}
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!isAuthenticated ? (
          <button
            onClick={navigateToLoginPage}
            style={{
              padding: "16px 32px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#ffffff",
              backgroundColor: "#111827",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "background-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#374151";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#111827";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            로그인하기
          </button>
        ) : (
          <button
            onClick={logoutFromWebView}
            style={{
              padding: "16px 32px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#ffffff",
              backgroundColor: "#dc2626",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "background-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#b91c1c";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#dc2626";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            로그아웃하기
          </button>
        )}
      </div>

      {/* 현재 위치 정보 */}
      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#f9fafb",
          borderRadius: "12px",
        }}
      >
        <button
          onClick={requestLocationFromWebView}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: "16px",
            fontWeight: 600,
            color: "#ffffff",
            backgroundColor: "#3b82f6",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.2s",
            marginBottom: "16px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2563eb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#3b82f6";
          }}
        >
          📍 현재 위치 가져오기
        </button>

        {latitude != null && longitude != null ? (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>현재 위치</div>
            <div style={{ color: "#6b7280", lineHeight: "1.6" }}>
              <div>
                위도: <span style={{ color: "#111827", fontWeight: 500 }}>{latitude}</span>
              </div>
              <div>
                경도: <span style={{ color: "#111827", fontWeight: 500 }}>{longitude}</span>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              textAlign: "center",
              color: "#9ca3af",
              fontSize: "14px",
            }}
          >
            위치 정보가 없습니다. 버튼을 클릭하여 위치를 가져오세요.
          </div>
        )}
      </div>
    </div>
  );
}

// 스토어 목록 섹션 컴포넌트
function StoreListSection({ storeIds }: { storeIds: string[] }) {
  return (
    <div style={{ marginBottom: "60px" }}>
      <h2
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "#111827",
          marginBottom: "24px",
        }}
      >
        스토어 목록 (QA용)
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {storeIds.map((storeId) => (
          <StoreItem key={storeId} storeId={storeId} />
        ))}
      </div>
    </div>
  );
}

// 스토어 아이템 컴포넌트
function StoreItem({ storeId }: { storeId: string }) {
  const { data: store } = useStoreDetail(storeId);

  const handleNaverClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (store) {
      window.location.href = `nmap://route/car?dlat=${store.latitude}&dlng=${store.longitude}`;
    }
  };

  const handleKakaoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (store) {
      window.location.href = `kakaomap://route?ep=${store.latitude},${store.longitude}&by=CAR`;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <Link
        href={`/store/${storeId}`}
        style={{
          flex: 1,
          padding: "16px",
          backgroundColor: "#f3f4f6",
          borderRadius: "8px",
          color: "#111827",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        🏪 스토어: {storeId}
      </Link>
      {store && (
        <>
          <button
            onClick={handleNaverClick}
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#ffffff",
              backgroundColor: "#03C75A",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            네이버
          </button>
          <button
            onClick={handleKakaoClick}
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#000000",
              backgroundColor: "#FEE500",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            카카오
          </button>
        </>
      )}
    </div>
  );
}
