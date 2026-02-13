/**
 * 주문 관련 React Query 키 상수
 */
export const orderQueryKeys = {
  all: ["orders"] as const,
  detail: (orderId: string) => [...orderQueryKeys.all, "detail", orderId] as const,
};
