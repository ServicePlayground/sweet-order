"use client";

import DOMPurify from "isomorphic-dompurify";

interface ProductDetailDescriptionSectionProps {
  detailDescription?: string;
  variant?: "default" | "tab";
}

export function ProductDetailDescriptionSection({
  detailDescription,
  variant = "default",
}: ProductDetailDescriptionSectionProps) {
  if (!detailDescription) {
    return null;
  }

  const sanitizedDescription = DOMPurify.sanitize(detailDescription);

  const isTabVariant = variant === "tab";

  return (
    <div
      style={{
        backgroundColor: isTabVariant ? "transparent" : "#ffffff",
        borderRadius: isTabVariant ? 0 : "12px",
        padding: isTabVariant ? 0 : "32px",
        boxShadow: isTabVariant ? "none" : "0 2px 8px rgba(0, 0, 0, 0.04)",
        marginTop: isTabVariant ? 0 : "32px",
      }}
    >
      {!isTabVariant && (
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "24px",
          }}
        >
          상품 상세 설명
        </h2>
      )}
      <style>{`
        .product-detail-description img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 16px 0;
          border-radius: 8px;
        }
      `}</style>
      <div
        className="product-detail-description"
        style={{
          fontSize: "16px",
          color: "#374151",
          lineHeight: 1.8,
        }}
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      />
    </div>
  );
}
