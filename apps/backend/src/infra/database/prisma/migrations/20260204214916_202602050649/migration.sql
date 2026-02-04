/*
  Warnings:

  - Added the required column `zonecode` to the `stores` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `stores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `latitude` on table `stores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `stores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `roadAddress` on table `stores` required. This step will fail if there are existing NULL values in that column.

*/
-- 기존 NULL 값 처리: 주소 정보가 없는 스토어는 기본값으로 설정
UPDATE "stores" 
SET 
  "address" = COALESCE("address", '주소 미입력'),
  "roadAddress" = COALESCE("roadAddress", '주소 미입력'),
  "latitude" = COALESCE("latitude", 0.0),
  "longitude" = COALESCE("longitude", 0.0)
WHERE 
  "address" IS NULL 
  OR "roadAddress" IS NULL 
  OR "latitude" IS NULL 
  OR "longitude" IS NULL;

-- zonecode 컬럼 추가 (nullable로 먼저 추가)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'stores' AND column_name = 'zonecode'
  ) THEN
    ALTER TABLE "stores" ADD COLUMN "zonecode" TEXT;
  END IF;
END $$;

-- zonecode가 NULL인 경우 기본값 설정
UPDATE "stores" SET "zonecode" = '00000' WHERE "zonecode" IS NULL;

-- 이제 NOT NULL 제약 추가
ALTER TABLE "stores" 
  ALTER COLUMN "address" SET NOT NULL,
  ALTER COLUMN "latitude" SET NOT NULL,
  ALTER COLUMN "longitude" SET NOT NULL,
  ALTER COLUMN "roadAddress" SET NOT NULL,
  ALTER COLUMN "zonecode" SET NOT NULL;
