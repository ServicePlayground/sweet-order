-- AlterTable
ALTER TABLE "product_reviews" ADD COLUMN "order_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "product_reviews_order_id_key" ON "product_reviews"("order_id");

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
