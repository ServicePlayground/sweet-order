"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/apps/web-user/features/auth/store/auth.store";
import { useLogout } from "@/apps/web-user/features/auth/hooks/queries/useAuth";
import { useGetCartItems } from "@/apps/web-user/features/cart/hooks/queries/useGetCartItems";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { Icon } from "@/apps/web-user/common/components/icons";

interface HeaderProps {
  variant?: "main" | "product" | "minimal";
}

export default function Header({ variant = "main" }: HeaderProps) {
  const router = useRouter();
  const { isAuthenticated, user, isInitialized } = useAuthStore();
  const logoutMutation = useLogout();
  const { data: cartData } = useGetCartItems();

  const handleLogout = () => {
    if (confirm("정말 로그아웃 하시겠습니까?")) {
      logoutMutation.mutate();
    }
  };

  const cartItemCount = cartData?.data
    ? cartData.data.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  // 장바구니 버튼 컴포넌트 (공통)
  const CartButton = () => (
    <Link
      href={PATHS.CART}
      className="relative flex items-center justify-center rounded-lg text-gray-900 no-underline transition-all hover:bg-gray-100"
      aria-label="장바구니"
    >
      <Icon name="cart" width={24} height={24} />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white">
          {cartItemCount > 99 ? "99+" : cartItemCount}
        </span>
      )}
    </Link>
  );

  // Product 헤더: 뒤로가기 + 장바구니
  if (variant === "product") {
    return (
      <header className="px-5 flex justify-between items-center h-[52px]">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center rounded-lg border-none bg-transparent text-gray-900 cursor-pointer transition-all hover:bg-gray-100"
          aria-label="뒤로가기"
        >
          <Icon name="chevronLeft" width={24} height={24} />
        </button>

        {/* 장바구니 버튼 */}
        {isInitialized && isAuthenticated && user && <CartButton />}
      </header>
    );
  }

  // Minimal 헤더: 헤더 없음
  if (variant === "minimal") {
    return null;
  }

  // Main 헤더 (기본): 로고 + 장바구니 + 로그인/로그아웃
  return (
    <header className="px-10 flex justify-between items-center h-[160px] bg-white">
      {/* 로고 */}
      <Link href={PATHS.HOME} className="flex items-center no-underline" aria-label="홈으로 이동">
        <Image
          src="/images/logo/logo1.png"
          alt="로고"
          width={160}
          height={160}
          className="object-contain cursor-pointer"
        />
      </Link>

      {/* 우측 메뉴 */}
      <div className="flex items-center gap-4">
        {/* 장바구니 아이콘 (로그인한 사용자만 표시) */}
        {isInitialized && isAuthenticated && user && <CartButton />}

        {/* 로그인/로그아웃 버튼 */}
        <div>
          {!isInitialized ? null : isAuthenticated && user ? (
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              aria-label="로그아웃"
              className={`px-5 py-2.5 rounded-lg font-medium text-sm leading-6 border transition-all inline-block
                ${
                  logoutMutation.isPending
                    ? "cursor-not-allowed opacity-60 text-gray-500 bg-white border-gray-200"
                    : "cursor-pointer text-gray-500 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
            >
              {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
            </button>
          ) : (
            <Link
              href={PATHS.AUTH.LOGIN}
              aria-label="로그인"
              className="px-5 py-2.5 rounded-lg font-medium text-sm leading-6 cursor-pointer text-white bg-gray-900 border border-gray-900 no-underline inline-block transition-all hover:bg-gray-800 hover:border-gray-800"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
