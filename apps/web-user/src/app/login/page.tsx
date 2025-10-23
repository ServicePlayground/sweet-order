import { Metadata } from "next";
import Link from "next/link";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";

// 로그인 페이지 전용 SEO 메타데이터(TODO: 추후 수정필요)
export const metadata: Metadata = {
  title: "로그인",
  description:
    "Sweet Order에 로그인하여 달콤한 디저트를 주문하세요. 간편한 로그인으로 다양한 디저트를 만나보세요.",
  keywords: [
    "Sweet Order 로그인",
    "디저트 주문 로그인",
    "온라인 디저트 로그인",
    "케이크 주문 로그인",
  ],
  robots: {
    index: false, // 로그인 페이지는 검색엔진에서 제외
    follow: false,
  },
  openGraph: {
    title: "Sweet Order 로그인",
    description: "Sweet Order에 로그인하여 달콤한 디저트를 주문하세요.",
    type: "website",
    url: `https://sweetorders.com${PATHS.AUTH.LOGIN}`,
  },
};

export default function LoginPage() {
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
          borderRadius: "12px",
          padding: "48px 32px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#1a1a1a",
              margin: "0 0 8px 0",
            }}
          >
            로그인
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#666",
              margin: "0",
            }}
          >
            Sweet Order에 오신 것을 환영합니다
          </p>
        </div>

        <Link
          href={PATHS.AUTH.LOGIN_BASIC}
          style={{
            width: "100%",
            height: "52px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#1a1a1a",
            color: "white",
            fontSize: "16px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            transition: "all 0.2s ease",
            cursor: "pointer",
          }}
        >
          일반 로그인
        </Link>

        <Link
          href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_USER_DOMAIN}${PATHS.AUTH.GOOGLE_REDIRECT_URI}&response_type=code&scope=email+profile&prompt=select_account`}
          style={{
            width: "100%",
            height: "52px",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            backgroundColor: "white",
            color: "#1a1a1a",
            fontSize: "16px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            transition: "all 0.2s ease",
            cursor: "pointer",
          }}
        >
          구글 로그인
        </Link>

        <div
          style={{
            height: "1px",
            backgroundColor: "#e0e0e0",
            margin: "8px 0",
          }}
        />

        <Link
          href={PATHS.AUTH.FIND_ACCOUNT}
          style={{
            width: "100%",
            height: "44px",
            border: "none",
            backgroundColor: "transparent",
            color: "#666",
            fontSize: "14px",
            fontWeight: "500",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.2s ease",
            cursor: "pointer",
          }}
        >
          계정 찾기
        </Link>
      </div>
    </div>
  );
}
