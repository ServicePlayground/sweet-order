"use client";

import { use, useState } from "react";
import { useProductDetail } from "@/apps/web-user/features/product/hooks/queries/useProductDetail";
import { ProductDetailImageGallerySection } from "@/apps/web-user/features/product/components/sections/ProductDetailImageGallerySection";
import { ProductDetailInfoSection } from "@/apps/web-user/features/product/components/sections/ProductDetailInfoSection";
import { ProductDetailDescriptionSection } from "@/apps/web-user/features/product/components/sections/ProductDetailDescriptionSection";
import { ProductDetailInformationNoticeSection } from "@/apps/web-user/features/product/components/sections/ProductDetailInformationNoticeSection";
import { ProductDetailCancellationRefundSection } from "@/apps/web-user/features/product/components/sections/ProductDetailCancellationRefundSection";

interface ProductDetailPageProps {
  params: Promise<{ productId: string }>;
}

type TabType = "detail" | "notice" | "cancellationRefund";

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
    <div style={{ width: "100%", padding: "40px 20px" }}>
      {/* 상품 이미지 및 정보 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "48px",
          marginBottom: "32px",
        }}
      >
        {/* 이미지 갤러리 */}
        <div>
          <ProductDetailImageGallerySection images={data.images} productName={data.name} />
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
              borderBottom: activeTab === "detail" ? "2px solid #111827" : "2px solid transparent",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            상세정보
          </button>
          <button
            onClick={() => setActiveTab("notice")}
            style={{
              flex: 1,
              padding: "16px 24px",
              fontSize: "16px",
              fontWeight: activeTab === "notice" ? 700 : 500,
              color: activeTab === "notice" ? "#111827" : "#6b7280",
              borderBottom: activeTab === "notice" ? "2px solid #111827" : "2px solid transparent",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            상품정보제공고시
          </button>
          <button
            onClick={() => setActiveTab("cancellationRefund")}
            style={{
              flex: 1,
              padding: "16px 24px",
              fontSize: "16px",
              fontWeight: activeTab === "cancellationRefund" ? 700 : 500,
              color: activeTab === "cancellationRefund" ? "#111827" : "#6b7280",
              borderBottom:
                activeTab === "cancellationRefund" ? "2px solid #111827" : "2px solid transparent",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            취소 및 환불
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
          {activeTab === "notice" && (
            <ProductDetailInformationNoticeSection product={data} variant="tab" />
          )}
          {activeTab === "cancellationRefund" && (
            <ProductDetailCancellationRefundSection
              cancellationRefundDetailDescription={data.cancellationRefundDetailDescription}
              variant="tab"
            />
          )}
        </div>
      </div>
    </div>
  );
}
