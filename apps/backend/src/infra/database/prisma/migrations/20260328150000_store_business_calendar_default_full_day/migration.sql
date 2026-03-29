-- 기본 표준 영업: 00:00~00:00 = 하루 전체(앱에서 해석)
ALTER TABLE "stores" ALTER COLUMN "standard_open_time" SET DEFAULT '00:00';
ALTER TABLE "stores" ALTER COLUMN "standard_close_time" SET DEFAULT '00:00';

-- 과거 기본값(09:00~21:00)만 자동 전환 (판매자가 바꾼 값은 유지)
UPDATE "stores"
SET "standard_open_time" = '00:00', "standard_close_time" = '00:00'
WHERE "standard_open_time" = '09:00' AND "standard_close_time" = '21:00';
