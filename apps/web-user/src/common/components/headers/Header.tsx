"use client";

import Link from "next/link";
import Image from "next/image";
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
        padding: "0 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 160,
        backgroundColor: "#ffffff",
      }}
    >
      {/* 로고 */}
      <Link
        href={PATHS.HOME}
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
        }}
        aria-label="홈으로 이동"
      >
        <Image
          src="/images/logo/logo1.png"
          alt="로고"
          width={160}
          height={160}
          style={{
            objectFit: "contain",
            cursor: "pointer",
          }}
        />
      </Link>

      {/* 로그인 버튼 */}
      <div>
        {/* 초기화 전에는 아무 것도 렌더하지 않음 → 깜빡임 방지 */}
        {!isInitialized ? null : isAuthenticated && user ? (
          <div>
            <button
              onClick={handleLogout}
              style={{
                padding: "10px 20px",
                borderRadius: 12,
                fontWeight: 600,
                lineHeight: "1",
                cursor: "pointer",
                color: "#666666",
                backgroundColor: "#ffffff",
                border: "1px solid #e8e8e8",
                transition: "all 0.2s ease",
              }}
              disabled={logoutMutation.isPending}
              aria-label="로그아웃"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
                e.currentTarget.style.borderColor = "#d0d0d0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.borderColor = "#e8e8e8";
              }}
            >
              {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
            </button>
          </div>
        ) : (
          <Link
            href={PATHS.AUTH.LOGIN}
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              fontWeight: 600,
              lineHeight: "1",
              cursor: "pointer",
              color: "#ffffff",
              backgroundColor: "#000000",
              border: "1px solid #000000",
              textDecoration: "none",
              display: "inline-block",
              transition: "all 0.2s ease",
            }}
            aria-label="로그인"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#333333";
              e.currentTarget.style.borderColor = "#333333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#000000";
              e.currentTarget.style.borderColor = "#000000";
            }}
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
