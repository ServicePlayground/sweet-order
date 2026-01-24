"use client";

import { useState, useMemo } from "react";
import { Product, DeliveryMethod } from "@/apps/web-user/features/product/types/product.type";
import { Button } from "@/apps/web-user/common/components/buttons/Button";
import { useAddCartItem } from "@/apps/web-user/features/cart/hooks/mutations/useAddCartItem";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import { calculateTotalPrice } from "@/apps/web-user/features/product/utils/price.util";
import { isProductActive } from "@/apps/web-user/features/product/utils/orderForm-validator.util";

interface ProductDetailOrderFormSectionProps {
  product: Product;
}

export function ProductDetailOrderFormSection({ product }: ProductDetailOrderFormSectionProps) {
  const { showAlert } = useAlertStore();
  const addCartItemMutation = useAddCartItem();
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // 총 가격 계산
  const totalPrice = useMemo(() => {
    return product.salePrice;
  }, [product.salePrice]);

  // 장바구니 추가 핸들러
  const handleAddToCart = async () => {
    // 장바구니 추가 (deliveryMethod는 기본값 사용)
    await addCartItemMutation.mutateAsync({
      productId: product.id,
      quantity,
      orderFormData: undefined,
      deliveryMethod: DeliveryMethod.PICKUP, // 기본값으로 PICKUP 사용
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f9fafb",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "18px",
          fontWeight: 700,
          color: "#111827",
          marginBottom: isExpanded ? "20px" : "0",
          cursor: "pointer",
          padding: "4px 0",
          userSelect: "none",
        }}
      >
        <span>주문하기</span>
        <span
          style={{
            fontSize: "20px",
            color: "#6b7280",
            transition: "transform 0.2s ease",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </span>
      </div>

      {/* 수량 선택 */}
      {isExpanded && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <label
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#374151",
            }}
          >
            수량
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                backgroundColor: quantity <= 1 ? "#f5f5f5" : "#ffffff",
                color: quantity <= 1 ? "#9ca3af" : "#374151",
                cursor: quantity <= 1 ? "not-allowed" : "pointer",
                fontSize: "18px",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value) && value >= 1) {
                  setQuantity(value);
                }
              }}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                fontSize: "16px",
                fontWeight: 600,
                color: "#374151",
                textAlign: "center",
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3b82f6";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                if (quantity < 1) setQuantity(1);
              }}
            />
            <button
              type="button"
              onClick={() => setQuantity((prev) => prev + 1)}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                backgroundColor: "#f5f5f5",
                color: "#374151",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* 총 가격 */}
      {isExpanded && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0",
            marginTop: "20px",
            borderTop: "2px solid #e5e7eb",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            총 가격
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {(totalPrice * quantity).toLocaleString()}
            </span>
            <span style={{ fontSize: "16px", color: "#6b7280" }}>원</span>
          </div>
        </div>
      )}

      {/* 주문하기 및 장바구니 버튼 */}
      {isExpanded && (
        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <Button
            style={{
              flex: 1,
              padding: "16px",
              fontSize: "16px",
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              color: "#111827",
              border: "1px solid #e5e7eb",
            }}
            disabled={!isProductActive(product.salesStatus) || addCartItemMutation.isPending}
            onClick={handleAddToCart}
          >
            {addCartItemMutation.isPending ? "처리 중..." : "장바구니 담기"}
          </Button>
          <Button
            style={{
              flex: 1,
              padding: "16px",
              fontSize: "16px",
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: "#000000",
              color: "#ffffff",
            }}
            disabled={!isProductActive(product.salesStatus)}
          >
            {!isProductActive(product.salesStatus) ? "판매 중지" : "주문하기"}
          </Button>
        </div>
      )}
    </div>
  );
}
