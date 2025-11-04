"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/apps/web-user/features/auth/store/auth.store";
import { useLogout } from "@/apps/web-user/features/auth/hooks/queries/useAuth";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";

export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated, user, isInitialized } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    if (confirm("정말 로그아웃 하시겠습니까?")) {
      logoutMutation.mutate();
    }
  };

  // 인증 관련 페이지에서는 헤더를 렌더하지 않음
  if (pathname?.startsWith("/auth")) return null;

  return (
    <header
      style={{
        borderBottom: "1px solid #e0e0e0",
        padding: "0 20px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        height: 64,
        backgroundColor: "#ffffff",
      }}
    >
      {/* 로그인 버튼 */}
      <div>
        {/* 초기화 전에는 아무 것도 렌더하지 않음 → 깜빡임 방지 */}
        {!isInitialized ? null : isAuthenticated && user ? (
          <div>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                fontWeight: 600,
                lineHeight: "1",
                cursor: "pointer",
                color: "#333333",
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
              }}
              disabled={logoutMutation.isPending}
              aria-label="로그아웃"
            >
              {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
            </button>
          </div>
        ) : (
          <Link
            href={PATHS.AUTH.LOGIN}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              fontWeight: 600,
              lineHeight: "1",
              cursor: "pointer",
              color: "#ffffff",
              backgroundColor: "#000000",
              border: "1px solid #000000",
              textDecoration: "none",
              display: "inline-block",
            }}
            aria-label="로그인"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
