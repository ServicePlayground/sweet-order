"use client";

import { useConfirmStore } from "@/apps/web-user/common/store/confirm.store";

export function ConfirmAlert() {
  const { confirm, hideConfirm } = useConfirmStore();

  const handleConfirm = () => {
    if (confirm.onConfirm) {
      confirm.onConfirm();
    }
    hideConfirm();
  };

  const handleCancel = () => {
    if (confirm.onCancel) {
      confirm.onCancel();
    }
    hideConfirm();
  };

  if (!confirm.isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        opacity: 1,
        transition: "opacity 0.3s ease",
      }}
      onClick={handleCancel}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          maxWidth: "400px",
          width: "90%",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {confirm.title && (
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "12px",
              color: "#111827",
            }}
          >
            {confirm.title}
          </h2>
        )}
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            marginBottom: "24px",
            lineHeight: "1.5",
          }}
        >
          {confirm.message}
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
          }}
        >
          <button
            onClick={handleCancel}
            style={{
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              flex: 1,
            }}
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              flex: 1,
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
