"use client";

import { useAlertStore } from "@/apps/web-user/common/store/alert.store";

export function Alert() {
  const { alert, hideAlert } = useAlertStore();

  const handleClose = () => {
    setTimeout(hideAlert, 300); // 애니메이션 완료 후 닫기
  };

  if (!alert.isOpen) return null;

  const getIcon = () => {
    switch (alert.type) {
      case "error":
        return "⚠️";
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "ℹ️";
    }
  };

  const getTitleColor = () => {
    switch (alert.type) {
      case "error":
        return "#dc2626";
      case "success":
        return "#16a34a";
      case "warning":
        return "#d97706";
      case "info":
        return "#2563eb";
      default:
        return "#6b7280";
    }
  };

  const getButtonColor = () => {
    switch (alert.type) {
      case "error":
        return "#6b7280";
      case "success":
        return "#16a34a";
      case "warning":
        return "#d97706";
      case "info":
        return "#2563eb";
      default:
        return "#6b7280";
    }
  };

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
      onClick={handleClose}
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
        <div
          style={{
            fontSize: "48px",
            marginBottom: "16px",
          }}
        >
          {getIcon()}
        </div>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "12px",
            color: getTitleColor(),
          }}
        >
          {alert.title}
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            marginBottom: "24px",
            lineHeight: "1.5",
          }}
        >
          {alert.message}
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
          }}
        >
          <button
            onClick={handleClose}
            style={{
              backgroundColor: getButtonColor(),
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
