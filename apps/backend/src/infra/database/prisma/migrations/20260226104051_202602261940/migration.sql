-- CreateTable
CREATE TABLE "product_recent_views" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_recent_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_recent_views_user_id_viewed_at_idx" ON "product_recent_views"("user_id", "viewed_at" DESC);

-- CreateIndex
CREATE INDEX "product_recent_views_product_id_idx" ON "product_recent_views"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_recent_views_user_id_product_id_key" ON "product_recent_views"("user_id", "product_id");

-- AddForeignKey
ALTER TABLE "product_recent_views" ADD CONSTRAINT "product_recent_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_recent_views" ADD CONSTRAINT "product_recent_views_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
