"use client";

import { use, useState } from "react";
import { useProductDetail } from "@/apps/web-user/features/product/hooks/queries/useProductDetail";
import { ProductDetailImageGallerySection } from "@/apps/web-user/features/product/components/sections/ProductDetailImageGallerySection";
import { ProductDetailInfoSection } from "@/apps/web-user/features/product/components/sections/ProductDetailInfoSection";
import { ProductDetailDescriptionSection } from "@/apps/web-user/features/product/components/sections/ProductDetailDescriptionSection";
import { ProductDetailInformationNoticeSection } from "@/apps/web-user/features/product/components/sections/ProductDetailInformationNoticeSection";
import { ProductDetailReviewSection } from "@/apps/web-user/features/product/components/sections/ProductDetailReviewSection";

interface ProductDetailPageProps {
  params: Promise<{ productId: string }>;
}

type TabType = "detail" | "review" | "notice";

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId } = use(params);
  const { data, isLoading } = useProductDetail(productId);
  const [activeTab, setActiveTab] = useState<TabType>("detail");

  if (isLoading) {
    return <></>;
  }

  if (!data) {
    return (
      <div
        style={{
          width: "100%",
          margin: "0 auto",
          padding: "24px 20px",
          textAlign: "center",
          color: "#6b7280",
        }}
      >
        상품 정보를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div>
      {/* 상품 이미지 및 정보 */}
      <div>
        {/* 이미지 갤러리 */}
        <div>
          <ProductDetailImageGallerySection images={data.mainImage} productName={data.name} />
        </div>

        {/* 상품 정보 */}
        <div>
          <ProductDetailInfoSection product={data} />
        </div>
      </div>

      {/* 탭 영역 */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          marginTop: "32px",
        }}
      >
        {/* 탭 헤더 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            borderBottom: "1px solid #e5e7eb",
            padding: "0",
          }}
        >
          <button
            onClick={() => setActiveTab("detail")}
            style={{
              flex: 1,
              padding: "16px 24px",
              fontSize: "16px",
              fontWeight: activeTab === "detail" ? 700 : 500,
              color: activeTab === "detail" ? "#111827" : "#6b7280",
              border: "none",
              borderBottom: activeTab === "detail" ? "2px solid #111827" : "2px solid transparent",
              backgroundColor: "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            주문정보
          </button>
          <button
            onClick={() => setActiveTab("review")}
            style={{
              flex: 1,
              padding: "16px 24px",
              fontSize: "16px",
              fontWeight: activeTab === "review" ? 700 : 500,
              color: activeTab === "review" ? "#111827" : "#6b7280",
              border: "none",
              borderBottom: activeTab === "review" ? "2px solid #111827" : "2px solid transparent",
              backgroundColor: "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            후기
          </button>
          <button
            onClick={() => setActiveTab("notice")}
            style={{
              flex: 1,
              padding: "16px 24px",
              fontSize: "16px",
              fontWeight: activeTab === "notice" ? 700 : 500,
              color: activeTab === "notice" ? "#111827" : "#6b7280",
              border: "none",
              borderBottom: activeTab === "notice" ? "2px solid #111827" : "2px solid transparent",
              backgroundColor: "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            상세정보
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        <div style={{ padding: "32px" }}>
          {activeTab === "detail" && (
            <ProductDetailDescriptionSection
              detailDescription={data.detailDescription}
              variant="tab"
            />
          )}
          {activeTab === "review" && <ProductDetailReviewSection variant="tab" />}
          {activeTab === "notice" && (
            <ProductDetailInformationNoticeSection
              product={data}
              variant="tab"
              cancellationRefundDetailDescription={data.cancellationRefundDetailDescription}
            />
          )}
        </div>
      </div>
    </div>
  );
}
