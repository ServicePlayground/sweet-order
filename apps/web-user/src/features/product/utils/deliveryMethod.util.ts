/**
 * 배송 방법을 한국어 라벨로 변환하는 유틸리티 함수
 * @param method - 배송 방법 (PICKUP, DELIVERY 등)
 * @returns 한국어 라벨 (픽업, 배송 등)
 */
export const getDeliveryMethodLabel = (method: string): string => {
  if (method === "PICKUP" || method === "pickup") return "픽업";
  if (method === "DELIVERY" || method === "delivery") return "배송";
  return method;
};

