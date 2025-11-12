"use client";
import Link from "next/link";
import { useMemo } from "react";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { useConfirmStore } from "@/apps/web-user/common/store/confirm.store";
import { useGetCartItems } from "@/apps/web-user/features/cart/hooks/queries/useGetCartItems";
import { useRemoveCartItem } from "@/apps/web-user/features/cart/hooks/mutations/useRemoveCartItem";
import { useUpdateCartItem } from "@/apps/web-user/features/cart/hooks/mutations/useUpdateCartItem";
import { useClearCart } from "@/apps/web-user/features/cart/hooks/mutations/useClearCart";
import { CartItem } from "@/apps/web-user/features/cart/types/cart.type";
import { Button } from "@/apps/web-user/common/components/buttons/Button";
import { calculateTotalPrice } from "@/apps/web-user/features/product/utils/price.util";
import { CartList } from "@/apps/web-user/features/cart/components/list/CartList";
import { CartOrderSummaryForm } from "@/apps/web-user/features/cart/components/forms/CartOrderSummaryForm";

export default function CartPage() {
  const { data, isLoading } = useGetCartItems();
  const removeCartItemMutation = useRemoveCartItem();
  const updateCartItemMutation = useUpdateCartItem();
  const clearCartMutation = useClearCart();
  const { showConfirm } = useConfirmStore();

  const totalItems = useMemo(
    () => data?.data.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    [data?.data],
  );
  const totalPrice = useMemo(
    () =>
      data?.data.reduce((sum, item) => {
        const itemTotalPrice = calculateTotalPrice(
          item.product.salePrice,
          item.product.orderFormSchema || undefined,
          item.orderFormData || {},
        );
        return sum + itemTotalPrice * item.quantity;
      }, 0) ?? 0,
    [data?.data],
  );

  const handleQuantityChange = (cartItem: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;

    updateCartItemMutation.mutate({
      cartItemId: cartItem.id,
      data: { quantity: newQuantity },
    });
  };

  const handleRemoveItem = (cartItemId: string) => {
    showConfirm({
      message: "장바구니에서 이 상품을 삭제하시겠습니까?",
      onConfirm: () => {
        removeCartItemMutation.mutate(cartItemId);
      },
    });
  };

  const handleClearCart = () => {
    showConfirm({
      message: "장바구니를 모두 비우시겠습니까?",
      onConfirm: () => {
        clearCartMutation.mutate();
      },
    });
  };

  if (isLoading) {
    return (
      <div
        style={{
          width: "100%",
          padding: "40px 20px",
          textAlign: "center",
          color: "#6b7280",
        }}
      >
        장바구니를 불러오는 중...
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          gap: "24px",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            marginBottom: "16px",
          }}
        >
          🛒
        </div>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 600,
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          장바구니가 비어있습니다
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#6b7280",
            marginBottom: "24px",
          }}
        >
          원하는 상품을 장바구니에 담아보세요
        </p>
        <Link href={PATHS.HOME}>
          <Button
            style={{
              padding: "12px 24px",
              backgroundColor: "#111827",
              color: "#ffffff",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          >
            쇼핑하러 가기
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#111827",
          }}
        >
          장바구니
        </h1>
        {data.data.length > 0 && (
          <Button
            onClick={handleClearCart}
            disabled={clearCartMutation.isPending}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ffffff",
              color: "#ef4444",
              border: "1px solid #ef4444",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            전체 삭제
          </Button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {/* 장바구니 아이템 목록 */}
        <CartList
          items={data.data}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemoveItem}
          isUpdating={updateCartItemMutation.isPending}
          isRemoving={removeCartItemMutation.isPending}
        />

        {/* 주문 요약 */}
        <CartOrderSummaryForm
          totalItems={totalItems}
          totalPrice={totalPrice}
          onOrder={() => {
            // TODO: 주문하기 기능 구현
          }}
        />
      </div>
    </div>
  );
}
