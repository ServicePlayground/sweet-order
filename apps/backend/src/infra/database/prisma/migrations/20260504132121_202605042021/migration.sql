-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "refund_cancellation_policy" JSONB NOT NULL DEFAULT '{"rules":[{"daysBeforePickup":0,"refundDescription":""}]}';
