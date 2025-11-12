"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/apps/web-user/features/product/types/product.type";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  const router = useRouter();

  const handleProductClick = (productId: string) => {
    router.push(PATHS.PRODUCT.DETAIL(productId));
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "24px",
        marginBottom: "32px",
      }}
    >
      {products.map((product, index) => (
        <div
          key={`${product.id}-${index}`}
          onClick={() => handleProductClick(product.id)}
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
  );
}
