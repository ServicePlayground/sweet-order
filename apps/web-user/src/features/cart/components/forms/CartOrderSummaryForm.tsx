"use client";

import { Button } from "@/apps/web-user/common/components/buttons/Button";

interface CartOrderSummaryFormProps {
  totalItems: number;
  totalPrice: number;
  onOrder: () => void;
}

export function CartOrderSummaryForm({
  totalItems,
  totalPrice,
  onOrder,
}: CartOrderSummaryFormProps) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "24px",
        width: "100%",
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: "#111827",
          marginBottom: "24px",
        }}
      >
        주문 요약
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "16px",
            color: "#6b7280",
          }}
        >
          <span>상품 개수</span>
          <span>{totalItems}개</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "16px",
            color: "#6b7280",
          }}
        >
          <span>상품 금액</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "20px",
            fontWeight: 700,
            color: "#111827",
          }}
        >
          <span>총 결제금액</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
      </div>

      <Button
        onClick={onOrder}
        style={{
          width: "100%",
          padding: "16px",
          backgroundColor: "#111827",
          color: "#ffffff",
          borderRadius: "8px",
          fontSize: "18px",
          fontWeight: 600,
        }}
      >
        주문하기
      </Button>
    </div>
  );
}

