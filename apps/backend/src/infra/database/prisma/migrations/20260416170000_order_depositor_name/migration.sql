-- Add depositor name captured when user marks payment complete
ALTER TABLE "orders"
ADD COLUMN "depositor_name" TEXT;
