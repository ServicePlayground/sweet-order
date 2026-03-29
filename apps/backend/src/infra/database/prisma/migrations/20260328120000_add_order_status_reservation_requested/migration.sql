-- 예약신청 단계 (주문 생성 직후, 판매자 예약 확인 전)
ALTER TYPE "OrderStatus" ADD VALUE 'RESERVATION_REQUESTED';
