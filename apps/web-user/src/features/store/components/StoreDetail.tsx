"use client";

import { useState } from "react";
import { useStoreDetail } from "@/apps/web-user/features/store/hooks/queries/useStoreDetail";
import { LoadingFallback } from "@/apps/web-user/common/components/fallbacks/LoadingFallback";
import Image from "next/image";

interface StoreDetailProps {
  storeId: string;
}

export default function StoreDetail({ storeId }: StoreDetailProps) {
  const { data, isLoading } = useStoreDetail(storeId);
  const [imageError, setImageError] = useState(false);

  if (isLoading) {
    return <></>;
  }

  if (!data) {
    return <div>스토어 정보를 불러오지 못했습니다.</div>;
  }

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "24px",
          padding: "32px 24px",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          marginBottom: "32px",
        }}
      >
        {data.logoImageUrl && !imageError ? (
          <div
            style={{
              width: 200,
              height: 200,
              position: "relative",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid #e5e7eb",
              backgroundColor: "#f9fafb",
              flex: "0 0 auto",
            }}
          >
            <Image
              src={data.logoImageUrl}
              alt={`${data.name} 로고`}
              fill
              sizes="120px"
              style={{ objectFit: "cover" }}
              priority
              onError={() => setImageError(true)}
              unoptimized
            />
          </div>
        ) : (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f3f4f6",
              color: "#9ca3af",
              fontWeight: 600,
              fontSize: 14,
              border: "1px solid #e5e7eb",
              flex: "0 0 auto",
            }}
          >
            No Image
          </div>
        )}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, minWidth: 0 }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>
            {data.name}
          </div>
          <div
            style={{
              fontSize: 15,
              color: "#4b5563",
              lineHeight: 1.6,
              wordWrap: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {data.description || "소개가 없습니다."}
          </div>
        </div>
      </div>
    </div>
  );
}
