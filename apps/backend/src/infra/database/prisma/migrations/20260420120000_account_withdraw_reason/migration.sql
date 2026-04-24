ALTER TABLE "consumers"
ADD COLUMN "withdraw_reason" TEXT,
ADD COLUMN "withdrawn_at" TIMESTAMP(3);

ALTER TABLE "sellers"
ADD COLUMN "withdraw_reason" TEXT,
ADD COLUMN "withdrawn_at" TIMESTAMP(3);
