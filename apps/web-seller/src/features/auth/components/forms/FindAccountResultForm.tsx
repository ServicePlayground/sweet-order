import { Link } from "react-router-dom";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { FindAccountFormData } from "@/apps/web-seller/features/auth/types/auth.type";

interface FindAccountResultFormProps {
  accountInfo: FindAccountFormData;
}

export default function FindAccountResultForm({ accountInfo }: FindAccountResultFormProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        padding: "40px 20px",
        backgroundColor: "#fafafa",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "32px",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          계정 찾기 결과
        </h1>

        <div
          style={{
            width: "100%",
            textAlign: "center",
            padding: "24px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "600", color: "#333" }}>
            찾은 계정 정보
          </h2>

          {accountInfo.userId && (
            <div
              style={{
                marginBottom: "12px",
                padding: "16px",
                backgroundColor: "white",
                borderRadius: "6px",
                border: "1px solid #e0e0e0",
              }}
            >
              <strong style={{ color: "#333" }}>일반 로그인 계정:</strong>
              <span style={{ marginLeft: "8px", color: "#666" }}>{accountInfo.userId}</span>
            </div>
          )}

          {accountInfo.googleEmail && (
            <div
              style={{
                padding: "16px",
                backgroundColor: "white",
                borderRadius: "6px",
                border: "1px solid #e0e0e0",
              }}
            >
              <strong style={{ color: "#333" }}>구글 로그인 계정:</strong>
              <span style={{ marginLeft: "8px", color: "#666" }}>{accountInfo.googleEmail}</span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", width: "100%" }}>
          <Link
            to={ROUTES.AUTH.LOGIN}
            style={{
              flex: 1,
              height: "48px",
              border: "none",
              backgroundColor: "#000",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            로그인 페이지로 이동
          </Link>

          {accountInfo.userId && (
            <Link
              to={ROUTES.AUTH.RESET_PASSWORD}
              style={{
                flex: 1,
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f8f9fa",
                color: "#000",
                fontSize: "16px",
                fontWeight: "600",
                textDecoration: "none",
                borderRadius: "6px",
                border: "1px solid #e0e0e0",
              }}
            >
              비밀번호 재설정
            </Link>
          )}
        </div>

        <Link
          to={ROUTES.AUTH.LOGIN}
          style={{
            color: "#666",
            fontSize: "14px",
            textDecoration: "none",
            marginTop: "16px",
            textAlign: "center",
          }}
        >
          ← 로그인 페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
}
