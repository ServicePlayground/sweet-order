/*
  Warnings:

  - You are about to drop the column `seller_id` on the `products` table. All the data in that column will be lost.
  - You are about to drop the column `targetAudience` on the `products` table. All the data in that column will be lost.
  - You are about to drop the column `delivery_days` on the `products` table. All the data in that column will be lost.
  - You are about to drop the `TargetAudience` enum type. If the enum is not empty, the migration will fail.
  - You are about to drop the `DeliveryDays` enum type. If the enum is not empty, the migration will fail.
  - Made the column `product_number` on the `products` table required. This step will fail if there are existing NULL values in that column.
  - Added the required column `store_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX IF EXISTS "products_seller_id_idx";

-- DropIndex
DROP INDEX IF EXISTS "products_targetAudience_idx";

-- DropIndex
DROP INDEX IF EXISTS "products_delivery_days_idx";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_seller_id_fkey";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "store_id" TEXT NOT NULL;

-- AlterTable
-- Ensure product_number is required (it was already NOT NULL in the original schema, but this ensures consistency)
ALTER TABLE "products" ALTER COLUMN "product_number" SET NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "seller_id",
DROP COLUMN "targetAudience",
DROP COLUMN "delivery_days";

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_store_id_idx" ON "products"("store_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropEnum
DROP TYPE IF EXISTS "TargetAudience";

-- DropEnum
DROP TYPE IF EXISTS "DeliveryDays";

