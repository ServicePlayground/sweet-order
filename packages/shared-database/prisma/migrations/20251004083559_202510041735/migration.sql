-- CreateEnum
CREATE TYPE "public"."MainCategory" AS ENUM ('PRODUCT');

-- CreateEnum
CREATE TYPE "public"."SubCategory" AS ENUM ('CAKE');

-- CreateEnum
CREATE TYPE "public"."TargetAudience" AS ENUM ('ADULT', 'CHILD', 'PET');

-- CreateEnum
CREATE TYPE "public"."SizeRange" AS ENUM ('ONE_TO_TWO', 'TWO_TO_THREE', 'THREE_TO_FOUR', 'FOUR_TO_FIVE', 'FIVE_OR_MORE');

-- CreateEnum
CREATE TYPE "public"."DeliveryMethod" AS ENUM ('PICKUP', 'DELIVERY');

-- CreateEnum
CREATE TYPE "public"."DeliveryDays" AS ENUM ('SAME_DAY', 'ONE_TO_TWO', 'TWO_TO_THREE', 'THREE_TO_FOUR', 'FOUR_TO_FIVE', 'FIVE_TO_SIX', 'SIX_TO_SEVEN', 'OVER_WEEK');

-- CreateEnum
CREATE TYPE "public"."ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK');

-- CreateTable
CREATE TABLE "public"."products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "originalPrice" INTEGER NOT NULL,
    "salePrice" INTEGER NOT NULL,
    "notice" TEXT,
    "caution" TEXT,
    "basic_included" TEXT,
    "location" TEXT,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "order_form_schema" JSONB,
    "detail_description" TEXT,
    "product_number" TEXT NOT NULL,
    "food_type" TEXT NOT NULL,
    "producer" TEXT NOT NULL,
    "manufacture_date" TEXT NOT NULL,
    "package_info" TEXT NOT NULL,
    "calories" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "customer_service" TEXT NOT NULL,
    "main_category" "public"."MainCategory"[],
    "sub_category" "public"."SubCategory"[],
    "targetAudience" "public"."TargetAudience"[],
    "size_range" "public"."SizeRange"[],
    "deliveryMethod" "public"."DeliveryMethod"[],
    "delivery_days" "public"."DeliveryDays"[],
    "hashtags" TEXT[],
    "status" "public"."ProductStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_likes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "products_status_idx" ON "public"."products"("status");

-- CreateIndex
CREATE INDEX "products_created_at_idx" ON "public"."products"("created_at");

-- CreateIndex
CREATE INDEX "products_salePrice_idx" ON "public"."products"("salePrice");

-- CreateIndex
CREATE INDEX "products_like_count_idx" ON "public"."products"("like_count");

-- CreateIndex
CREATE INDEX "products_name_idx" ON "public"."products"("name");

-- CreateIndex
CREATE INDEX "products_hashtags_idx" ON "public"."products"("hashtags");

-- CreateIndex
CREATE INDEX "products_main_category_idx" ON "public"."products"("main_category");

-- CreateIndex
CREATE INDEX "products_sub_category_idx" ON "public"."products"("sub_category");

-- CreateIndex
CREATE INDEX "products_targetAudience_idx" ON "public"."products"("targetAudience");

-- CreateIndex
CREATE INDEX "products_size_range_idx" ON "public"."products"("size_range");

-- CreateIndex
CREATE INDEX "products_deliveryMethod_idx" ON "public"."products"("deliveryMethod");

-- CreateIndex
CREATE INDEX "products_delivery_days_idx" ON "public"."products"("delivery_days");

-- CreateIndex
CREATE INDEX "product_images_product_id_idx" ON "public"."product_images"("product_id");

-- CreateIndex
CREATE INDEX "product_likes_user_id_idx" ON "public"."product_likes"("user_id");

-- CreateIndex
CREATE INDEX "product_likes_product_id_idx" ON "public"."product_likes"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_likes_user_id_product_id_key" ON "public"."product_likes"("user_id", "product_id");

-- AddForeignKey
ALTER TABLE "public"."product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_likes" ADD CONSTRAINT "product_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_likes" ADD CONSTRAINT "product_likes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;


