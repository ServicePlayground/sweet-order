/*
  Warnings:

  - You are about to drop the column `business_status` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `business_status_code` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `close_date` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `online_trading_company_detail` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `tax_type` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `tax_type_code` on the `stores` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,business_no,permission_management_number]` on the table `stores` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."stores_user_id_key";

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "business_status",
DROP COLUMN "business_status_code",
DROP COLUMN "close_date",
DROP COLUMN "online_trading_company_detail",
DROP COLUMN "tax_type",
DROP COLUMN "tax_type_code";

-- CreateIndex
CREATE UNIQUE INDEX "stores_user_id_business_no_permission_management_number_key" ON "stores"("user_id", "business_no", "permission_management_number");
