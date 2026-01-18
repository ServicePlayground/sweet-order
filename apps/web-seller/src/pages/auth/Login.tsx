import { Link, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import {
  createUrlWithReturnUrl,
  createGoogleOAuthUrlWithReturnUrl,
} from "@/apps/web-seller/common/utils/returnUrl.util";

// 모두 인증이 필요할 때 여기 페이지 경로(/auth/login 경로로 리다이렉트됨, 이후 reutnUrl 유지한채로 리다이렉트됨)
export function LoginPage() {
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
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
          to={createUrlWithReturnUrl(ROUTES.AUTH.LOGIN_BASIC, returnUrl || undefined)}
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

        <a
          href={createGoogleOAuthUrlWithReturnUrl(
            `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}${ROUTES.AUTH.GOOGLE_REDIRECT_URI}&response_type=code&scope=email+profile&prompt=select_account`,
            returnUrl || undefined,
          )}
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
        </a>

        <div
          style={{
            height: "1px",
            backgroundColor: "#e0e0e0",
            margin: "8px 0",
          }}
        />

        <Link
          to={ROUTES.AUTH.FIND_ACCOUNT}
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

