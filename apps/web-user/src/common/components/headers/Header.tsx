"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetCartItems } from "@/apps/web-user/features/cart/hooks/queries/useGetCartItems";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { Icon } from "@/apps/web-user/common/components/icons";

interface HeaderProps {
  variant?: "main" | "product" | "minimal";
}

export default function Header({ variant = "main" }: HeaderProps) {
  const router = useRouter();
  const { data: cartData } = useGetCartItems();

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
        <CartButton />
      </header>
    );
  }

  // Minimal 헤더: 헤더 없음
  if (variant === "minimal") {
    return null;
  }

  // Main 헤더 (기본): 로고 + 장바구니
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
        {/* 장바구니 아이콘 */}
        <CartButton />
      </div>
    </header>
  );
}
