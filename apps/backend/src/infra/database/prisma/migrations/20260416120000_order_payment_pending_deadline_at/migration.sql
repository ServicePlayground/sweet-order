-- 입금대기 만료 시각(픽업까지 남은 시간에 따른 티어 + 픽업 시각 상한)
ALTER TABLE "orders" ADD COLUMN "payment_pending_deadline_at" TIMESTAMP(3);

-- 기존 입금대기 주문: 전환 시각 기준 티어와 픽업 시각 중 이른 쪽을 마감으로 설정
UPDATE "orders"
SET "payment_pending_deadline_at" = LEAST(
  COALESCE("payment_pending_at", "created_at") + (
    CASE
      WHEN "pickup_date" IS NULL THEN INTERVAL '12 hours'
      WHEN "pickup_date" - COALESCE("payment_pending_at", "created_at") > INTERVAL '12 hours' THEN INTERVAL '12 hours'
      WHEN "pickup_date" - COALESCE("payment_pending_at", "created_at") > INTERVAL '6 hours' THEN INTERVAL '6 hours'
      ELSE INTERVAL '1 hour'
    END
  ),
  COALESCE("pickup_date", COALESCE("payment_pending_at", "created_at") + INTERVAL '12 hours')
)
WHERE "order_status" = 'PAYMENT_PENDING';

CREATE INDEX "orders_order_status_payment_pending_deadline_at_idx" ON "orders" ("order_status", "payment_pending_deadline_at");
