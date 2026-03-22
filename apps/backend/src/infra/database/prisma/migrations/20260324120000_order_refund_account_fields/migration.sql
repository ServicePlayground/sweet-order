-- AlterTable
ALTER TABLE "orders" ADD COLUMN "refund_request_reason" TEXT,
ADD COLUMN "refund_bank_name" "StoreBankName",
ADD COLUMN "refund_bank_account_number" TEXT,
ADD COLUMN "refund_account_holder_name" TEXT;
