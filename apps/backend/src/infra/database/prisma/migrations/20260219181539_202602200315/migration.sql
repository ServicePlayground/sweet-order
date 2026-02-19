/*
  Warnings:

  - You are about to drop the column `pickup_date` on the `order_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "pickup_date";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "pickup_date" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "orders_pickup_date_idx" ON "orders"("pickup_date");
