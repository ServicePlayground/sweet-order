-- AlterTable: 후기 소프트 삭제 (주문당 1행 유지로 재작성 불가 표현)
ALTER TABLE "product_reviews" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP(3);

-- 기존 orders.user_review_withdrawn_at 만 있던 경우 → 삭제된 후기 자리표시 행으로 이전
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'user_review_withdrawn_at'
  ) THEN
    INSERT INTO "product_reviews" ("id", "product_id", "user_id", "order_id", "rating", "content", "image_urls", "created_at", "updated_at", "deleted_at")
    SELECT gen_random_uuid()::text, o."product_id", o."user_id", o."id", 0, '', ARRAY[]::TEXT[],
      COALESCE(o."user_review_withdrawn_at", NOW()),
      NOW(),
      COALESCE(o."user_review_withdrawn_at", NOW())
    FROM "orders" o
    WHERE o."user_review_withdrawn_at" IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM "product_reviews" pr WHERE pr."order_id" = o."id");

    ALTER TABLE "orders" DROP COLUMN "user_review_withdrawn_at";
  END IF;
END $$;
