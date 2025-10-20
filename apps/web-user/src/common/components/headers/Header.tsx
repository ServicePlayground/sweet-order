"use client";

import Link from "next/link";
import { useAuthStore } from "@/apps/web-user/features/auth/store/auth.store";
import { useLogout } from "@/apps/web-user/features/auth/hooks/queries/useAuth";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";

export default function Header() {
  const { isAuthenticated, user, isInitialized } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    if (confirm("정말 로그아웃 하시겠습니까?")) {
      logoutMutation.mutate();
    }
  };

  return (
    <header
      style={{
        borderBottom: "1px solid #e0e0e0",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* 로그인 버튼 */}
      <div>
        {/* 초기화 전에는 아무 것도 렌더하지 않음 → 깜빡임 방지 */}
        {!isInitialized ? null : isAuthenticated && user ? (
          <div>
            <button onClick={handleLogout}>로그아웃</button>
          </div>
        ) : (
          <Link href={PATHS.AUTH.LOGIN}>로그인</Link>
        )}
      </div>
    </header>
  );
}
