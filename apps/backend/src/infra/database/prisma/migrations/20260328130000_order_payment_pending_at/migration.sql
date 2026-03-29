-- 입금대기 단계 진입 시각(12시간 만료는 이 시점부터만 적용)
ALTER TABLE "orders" ADD COLUMN "payment_pending_at" TIMESTAMP(3);

-- 기존 입금대기 주문: 생성 시각을 입금 유효 기준 시작으로 간주(레거시)
UPDATE "orders"
SET "payment_pending_at" = "created_at"
WHERE "order_status" = 'PAYMENT_PENDING';
