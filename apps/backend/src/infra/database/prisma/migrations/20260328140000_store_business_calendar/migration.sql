-- 영업 캘린더(정기 휴무·표준 시간·일별 오버라이드)
ALTER TABLE "stores" ADD COLUMN "weekly_closed_weekdays" INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[];
ALTER TABLE "stores" ADD COLUMN "standard_open_time" VARCHAR(5) NOT NULL DEFAULT '09:00';
ALTER TABLE "stores" ADD COLUMN "standard_close_time" VARCHAR(5) NOT NULL DEFAULT '21:00';
ALTER TABLE "stores" ADD COLUMN "business_calendar_overrides" JSONB NOT NULL DEFAULT '[]';
