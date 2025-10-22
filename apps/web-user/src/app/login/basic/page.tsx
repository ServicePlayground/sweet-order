import { Metadata } from "next";
import Link from "next/link";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import LoginForm from "@/apps/web-user/features/auth/components/forms/LoginForm";

// 로그인 페이지 전용 SEO 메타데이터(TODO: 추후 수정필요)
export const metadata: Metadata = {
  title: "일반 로그인",
  description: "아이디와 비밀번호로 로그인합니다.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "일반 로그인",
    description: "아이디와 비밀번호로 로그인합니다.",
    type: "website",
    url: `https://sweetorders.com${PATHS.AUTH.LOGIN_BASIC}`,
  },
};

export default function BasicLoginPage() {
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
          maxWidth: "400px",
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{ textAlign: "center", marginBottom: "32px", fontSize: "24px", fontWeight: "600" }}
        >
          일반 로그인
        </h1>
        <LoginForm />
        <div style={{ border: "1px solid #e0e0e0", width: "100%", margin: "24px 0" }} />
        <div
          style={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center" }}
        >
          <Link
            href={PATHS.AUTH.REGISTER_BASIC}
            style={{ color: "#666", textDecoration: "none", fontSize: "14px" }}
          >
            회원가입
          </Link>
          <span style={{ color: "#ddd" }}>|</span>
          <Link
            href={PATHS.AUTH.RESET_PASSWORD}
            style={{ color: "#666", textDecoration: "none", fontSize: "14px" }}
          >
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}
