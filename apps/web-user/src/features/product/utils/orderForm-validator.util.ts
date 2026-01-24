import { SalesStatus } from "@/apps/web-user/features/product/types/product.type";

/**
 * 디테일한 검증은 백엔드에서 하도록 함
 */

/**
 * 상품이 활성 상태(판매중)인지 확인하는 함수
 * @param salesStatus - 상품 판매 상태
 * @returns 활성 상태 여부 (true: 활성, false: 비활성)
 */
export const isProductActive = (salesStatus: SalesStatus): boolean => {
  return salesStatus === SalesStatus.ENABLE;
};

/**
 * 재고가 충분한지 확인하는 함수
 * @param stock - 현재 재고
 * @param quantity - 주문 수량
 * @returns 재고 충분 여부 (true: 충분, false: 부족)
 */
export const isStockAvailable = (stock: number, quantity: number): boolean => {
  return stock >= quantity && stock > 0;
};
