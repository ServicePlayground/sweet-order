"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductDetailImageGallerySectionProps {
  images: string[];
  productName: string;
}

export function ProductDetailImageGallerySection({
  images,
  productName,
}: ProductDetailImageGallerySectionProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          backgroundColor: "#f9fafb",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
          fontSize: "16px",
          fontWeight: 600,
          border: "1px solid #e5e7eb",
        }}
      >
        No Image
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* 메인 이미지 */}
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          position: "relative",
          backgroundColor: "#f9fafb",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
        }}
      >
        <Image
          src={images[selectedImageIndex]}
          alt={`${productName} - 이미지 ${selectedImageIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
          priority
          unoptimized
        />
      </div>

      {/* 썸네일 이미지 목록 */}
      {images.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            paddingBottom: "8px",
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              style={{
                width: "80px",
                height: "80px",
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
                border: `2px solid ${selectedImageIndex === index ? "#000000" : "#e5e7eb"}`,
                backgroundColor: "#f9fafb",
                flexShrink: 0,
                transition: "border-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (selectedImageIndex !== index) {
                  e.currentTarget.style.borderColor = "#9ca3af";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedImageIndex !== index) {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }
              }}
            >
              <Image
                src={image}
                alt={`${productName} - 썸네일 ${index + 1}`}
                fill
                sizes="80px"
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
