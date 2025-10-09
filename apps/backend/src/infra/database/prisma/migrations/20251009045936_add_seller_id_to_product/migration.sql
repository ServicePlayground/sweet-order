/*
  Warnings:

  - Added the required column `seller_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "seller_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "products_seller_id_idx" ON "products"("seller_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
