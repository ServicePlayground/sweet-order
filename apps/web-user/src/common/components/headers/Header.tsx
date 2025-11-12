"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/apps/web-user/features/auth/store/auth.store";
import { useLogout } from "@/apps/web-user/features/auth/hooks/queries/useAuth";
import { useGetCartItems } from "@/apps/web-user/features/cart/hooks/queries/useGetCartItems";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";

export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated, user, isInitialized } = useAuthStore();
  const logoutMutation = useLogout();
  // 로그인한 사용자에게만 장바구니 데이터 조회
  const { data: cartData } = useGetCartItems();

  const handleLogout = () => {
    if (confirm("정말 로그아웃 하시겠습니까?")) {
      logoutMutation.mutate();
    }
  };

  // 인증 관련 페이지에서는 헤더를 렌더하지 않음
  if (pathname?.startsWith("/auth")) return null;

  // 장바구니 아이템 개수 계산
  const cartItemCount = cartData?.data
    ? cartData.data.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <header
      style={{
        padding: "0 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 80,
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
          width={240}
          height={70}
          style={{
            objectFit: "contain",
            cursor: "pointer",
          }}
        />
      </Link>

      {/* 우측 메뉴 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* 장바구니 아이콘 (로그인한 사용자만 표시) */}
        {isInitialized && isAuthenticated && user && (
          <Link
            href={PATHS.CART}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#111827",
              transition: "all 0.2s ease",
            }}
            aria-label="장바구니"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {cartItemCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  minWidth: "20px",
                  height: "20px",
                  padding: "0 6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 700,
                  borderRadius: "10px",
                  border: "2px solid #ffffff",
                }}
              >
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Link>
        )}

        {/* 로그인/로그아웃 버튼 */}
        <div>
          {/* 초기화 전에는 아무 것도 렌더하지 않음 → 깜빡임 방지 */}
          {!isInitialized ? null : isAuthenticated && user ? (
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              aria-label="로그아웃"
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "1.5",
                cursor: logoutMutation.isPending ? "not-allowed" : "pointer",
                color: "#6b7280",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                textDecoration: "none",
                display: "inline-block",
                transition: "all 0.2s ease",
                opacity: logoutMutation.isPending ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!logoutMutation.isPending) {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                  e.currentTarget.style.borderColor = "#d1d5db";
                  e.currentTarget.style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                if (!logoutMutation.isPending) {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.color = "#6b7280";
                }
              }}
            >
              {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
            </button>
          ) : (
            <Link
              href={PATHS.AUTH.LOGIN}
              aria-label="로그인"
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "1.5",
                cursor: "pointer",
                color: "#ffffff",
                backgroundColor: "#111827",
                border: "1px solid #111827",
                textDecoration: "none",
                display: "inline-block",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1f2937";
                e.currentTarget.style.borderColor = "#1f2937";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#111827";
                e.currentTarget.style.borderColor = "#111827";
              }}
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
