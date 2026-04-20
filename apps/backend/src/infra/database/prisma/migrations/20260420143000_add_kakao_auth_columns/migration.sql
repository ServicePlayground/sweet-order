-- Add kakao OAuth columns to consumers and sellers
ALTER TABLE "consumers"
ADD COLUMN "kakao_id" TEXT,
ADD COLUMN "kakao_email" TEXT;

ALTER TABLE "sellers"
ADD COLUMN "kakao_id" TEXT,
ADD COLUMN "kakao_email" TEXT;

CREATE UNIQUE INDEX "consumers_kakao_id_key" ON "consumers"("kakao_id");
CREATE INDEX "consumers_kakao_id_idx" ON "consumers"("kakao_id");

CREATE UNIQUE INDEX "sellers_kakao_id_key" ON "sellers"("kakao_id");
CREATE INDEX "sellers_kakao_id_idx" ON "sellers"("kakao_id");
