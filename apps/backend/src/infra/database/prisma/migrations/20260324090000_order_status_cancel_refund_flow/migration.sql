-- 판매자 예약 취소 사유
ALTER TABLE "orders" ADD COLUMN "seller_cancel_reason" TEXT;

-- OrderStatus: 사용자/판매자 취소완료·환불대기·환불완료 → 취소완료·취소환불대기·취소환불완료
CREATE TYPE "OrderStatus_new" AS ENUM (
  'PAYMENT_PENDING',
  'PAYMENT_COMPLETED',
  'CONFIRMED',
  'PICKUP_PENDING',
  'PICKUP_COMPLETED',
  'CANCEL_COMPLETED',
  'CANCEL_REFUND_PENDING',
  'CANCEL_REFUND_COMPLETED',
  'NO_SHOW'
);

ALTER TABLE "orders" ALTER COLUMN "order_status" DROP DEFAULT;

ALTER TABLE "orders" ALTER COLUMN "order_status" TYPE "OrderStatus_new" USING (
  CASE "order_status"::text
    WHEN 'PAYMENT_PENDING' THEN 'PAYMENT_PENDING'::"OrderStatus_new"
    WHEN 'PAYMENT_COMPLETED' THEN 'PAYMENT_COMPLETED'::"OrderStatus_new"
    WHEN 'CONFIRMED' THEN 'CONFIRMED'::"OrderStatus_new"
    WHEN 'PICKUP_PENDING' THEN 'PICKUP_PENDING'::"OrderStatus_new"
    WHEN 'PICKUP_COMPLETED' THEN 'PICKUP_COMPLETED'::"OrderStatus_new"
    WHEN 'USER_RESERVATION_CANCEL_COMPLETED' THEN 'CANCEL_COMPLETED'::"OrderStatus_new"
    WHEN 'SELLER_RESERVATION_CANCEL_COMPLETED' THEN 'CANCEL_COMPLETED'::"OrderStatus_new"
    WHEN 'REFUND_PENDING' THEN 'CANCEL_REFUND_PENDING'::"OrderStatus_new"
    WHEN 'REFUND_COMPLETED' THEN 'CANCEL_REFUND_COMPLETED'::"OrderStatus_new"
    WHEN 'NO_SHOW' THEN 'NO_SHOW'::"OrderStatus_new"
    ELSE 'PAYMENT_PENDING'::"OrderStatus_new"
  END
);

ALTER TABLE "orders" ALTER COLUMN "order_status" SET DEFAULT 'PAYMENT_PENDING'::"OrderStatus_new";

DROP TYPE "OrderStatus";

ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
