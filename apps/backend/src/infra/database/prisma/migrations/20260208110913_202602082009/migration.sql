-- DropIndex
DROP INDEX "public"."product_reviews_created_at_idx";

-- DropIndex
DROP INDEX "public"."product_reviews_product_id_idx";

-- DropIndex
DROP INDEX "public"."product_reviews_rating_idx";

-- DropIndex
DROP INDEX "public"."products_created_at_idx";

-- DropIndex
DROP INDEX "public"."products_like_count_idx";

-- DropIndex
DROP INDEX "public"."products_sale_price_idx";

-- DropIndex
DROP INDEX "public"."products_sales_status_idx";

-- DropIndex
DROP INDEX "public"."products_visibility_status_idx";

-- DropIndex
DROP INDEX "public"."store_feeds_created_at_idx";

-- DropIndex
DROP INDEX "public"."store_feeds_store_id_idx";

-- CreateIndex
CREATE INDEX "product_reviews_product_id_created_at_idx" ON "product_reviews"("product_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "product_reviews_product_id_rating_desc_created_at_idx" ON "product_reviews"("product_id", "rating" DESC, "created_at" DESC);

-- CreateIndex
CREATE INDEX "product_reviews_product_id_rating_asc_created_at_idx" ON "product_reviews"("product_id", "rating" ASC, "created_at" DESC);

-- CreateIndex
CREATE INDEX "products_visibility_status_sales_status_created_at_idx" ON "products"("visibility_status", "sales_status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "products_visibility_status_sales_status_sale_price_idx" ON "products"("visibility_status", "sales_status", "sale_price");

-- CreateIndex
CREATE INDEX "products_visibility_status_sales_status_like_count_idx" ON "products"("visibility_status", "sales_status", "like_count" DESC);

-- CreateIndex
CREATE INDEX "store_feeds_store_id_created_at_idx" ON "store_feeds"("store_id", "created_at" DESC);
