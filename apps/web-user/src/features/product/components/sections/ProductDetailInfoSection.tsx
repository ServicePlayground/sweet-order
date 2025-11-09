"use client";

import { Product } from "@/apps/web-user/features/product/types/product.type";
import { ProductDetailOrderFormSection } from "./ProductDetailOrderFormSection";

interface ProductDetailInfoSectionProps {
  product: Product;
}

export function ProductDetailInfoSection({ product }: ProductDetailInfoSectionProps) {
  const discountRate =
    product.originalPrice > product.salePrice
      ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)
      : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 상품명 및 좋아요 */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "12px",
          }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.3,
              flex: 1,
            }}
          >
            {product.name}
          </h1>
          {/* 좋아요 버튼 및 숫자 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                backgroundColor: product.isLiked ? "#fee2e2" : "#ffffff",
                color: product.isLiked ? "#ef4444" : "#6b7280",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = product.isLiked ? "#fecaca" : "#f9fafb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = product.isLiked ? "#fee2e2" : "#ffffff";
              }}
            >
              <span>{product.isLiked ? "❤️" : "🤍"}</span>
              <span>{product.likeCount}</span>
            </button>
          </div>
        </div>
        {product.description && (
          <p
            style={{
              fontSize: "16px",
              color: "#6b7280",
              lineHeight: 1.6,
              marginTop: "8px",
            }}
          >
            {product.description}
          </p>
        )}
      </div>

      {/* 가격 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {discountRate > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontSize: "14px",
                color: "#ef4444",
                fontWeight: 600,
                backgroundColor: "#fee2e2",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              {discountRate}% 할인
            </span>
            <span
              style={{
                fontSize: "18px",
                color: "#9ca3af",
                textDecoration: "line-through",
              }}
            >
              {product.originalPrice.toLocaleString()}원
            </span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {product.salePrice.toLocaleString()}
          </span>
          <span
            style={{
              fontSize: "20px",
              color: "#6b7280",
            }}
          >
            원
          </span>
        </div>
      </div>

      {/* 공지사항 및 주의사항 */}
      {product.notice && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#fef3c7",
            borderRadius: "8px",
            border: "1px solid #fde68a",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#92400e",
              marginBottom: "8px",
            }}
          >
            📌 공지사항
          </div>
          <div style={{ fontSize: "14px", color: "#78350f", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {product.notice.replace(/\\n/g, "\n")}
          </div>
        </div>
      )}

      {product.caution && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#fee2e2",
            borderRadius: "8px",
            border: "1px solid #fecaca",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#991b1b",
              marginBottom: "8px",
            }}
          >
            ⚠️ 주의사항
          </div>
          <div style={{ fontSize: "14px", color: "#7f1d1d", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {product.caution.replace(/\\n/g, "\n")}
          </div>
        </div>
      )}

      {product.basicIncluded && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#f0fdf4",
            borderRadius: "8px",
            border: "1px solid #bbf7d0",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#166534",
              marginBottom: "8px",
            }}
          >
            📦 기본 포함
          </div>
          <div style={{ fontSize: "14px", color: "#14532d", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {product.basicIncluded.replace(/\\n/g, "\n")}
          </div>
        </div>
      )}

      {/* 해시태그 */}
      {product.hashtags && product.hashtags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {product.hashtags.map((tag, index) => (
            <span
              key={index}
              style={{
                fontSize: "14px",
                color: "#6b7280",
                backgroundColor: "#f3f4f6",
                padding: "6px 12px",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 주문 폼 */}
      <ProductDetailOrderFormSection product={product} />
    </div>
  );
}
