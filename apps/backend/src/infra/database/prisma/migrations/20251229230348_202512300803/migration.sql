/*
  Warnings:

  - You are about to drop the column `basic_included` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `cancellation_refund_detail_description` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `caution` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryMethod` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `hashtags` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `main_category` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `notice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `order_form_schema` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `originalPrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `size_range` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `carts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image_upload_enabled` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lettering_max_length` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lettering_required` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `main_image` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sale_price` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sales_status` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visibility_status` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OptionRequired" AS ENUM ('REQUIRED', 'OPTIONAL');

-- CreateEnum
CREATE TYPE "EnableStatus" AS ENUM ('ENABLE', 'DISABLE');

-- DropForeignKey
ALTER TABLE "public"."carts" DROP CONSTRAINT "carts_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."carts" DROP CONSTRAINT "carts_user_id_fkey";

-- DropIndex
DROP INDEX "public"."products_deliveryMethod_idx";

-- DropIndex
DROP INDEX "public"."products_hashtags_idx";

-- DropIndex
DROP INDEX "public"."products_main_category_idx";

-- DropIndex
DROP INDEX "public"."products_salePrice_idx";

-- DropIndex
DROP INDEX "public"."products_size_range_idx";

-- DropIndex
DROP INDEX "public"."products_status_idx";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "basic_included",
DROP COLUMN "cancellation_refund_detail_description",
DROP COLUMN "caution",
DROP COLUMN "deliveryMethod",
DROP COLUMN "description",
DROP COLUMN "hashtags",
DROP COLUMN "images",
DROP COLUMN "location",
DROP COLUMN "main_category",
DROP COLUMN "notice",
DROP COLUMN "order_form_schema",
DROP COLUMN "originalPrice",
DROP COLUMN "salePrice",
DROP COLUMN "size_range",
DROP COLUMN "status",
DROP COLUMN "stock",
ADD COLUMN     "additional_images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "cake_flavor_options" JSONB,
ADD COLUMN     "cake_size_options" JSONB,
ADD COLUMN     "image_upload_enabled" "EnableStatus",
ADD COLUMN     "lettering_max_length" INTEGER,
ADD COLUMN     "lettering_required" "OptionRequired",
ADD COLUMN     "main_image" TEXT,
ADD COLUMN     "sale_price" INTEGER,
ADD COLUMN     "sales_status" "EnableStatus",
ADD COLUMN     "visibility_status" "EnableStatus";

-- Set default values for existing rows
UPDATE "products" SET 
  "image_upload_enabled" = 'DISABLE' WHERE "image_upload_enabled" IS NULL;
UPDATE "products" SET 
  "lettering_max_length" = 20 WHERE "lettering_max_length" IS NULL;
UPDATE "products" SET 
  "lettering_required" = 'OPTIONAL' WHERE "lettering_required" IS NULL;
UPDATE "products" SET 
  "main_image" = '' WHERE "main_image" IS NULL;
UPDATE "products" SET 
  "sale_price" = 0 WHERE "sale_price" IS NULL;
UPDATE "products" SET 
  "sales_status" = 'DISABLE' WHERE "sales_status" IS NULL;
UPDATE "products" SET 
  "visibility_status" = 'DISABLE' WHERE "visibility_status" IS NULL;

-- Add NOT NULL constraints
ALTER TABLE "products" 
  ALTER COLUMN "image_upload_enabled" SET NOT NULL,
  ALTER COLUMN "lettering_max_length" SET NOT NULL,
  ALTER COLUMN "lettering_required" SET NOT NULL,
  ALTER COLUMN "main_image" SET NOT NULL,
  ALTER COLUMN "sale_price" SET NOT NULL,
  ALTER COLUMN "sales_status" SET NOT NULL,
  ALTER COLUMN "visibility_status" SET NOT NULL;

-- DropTable
DROP TABLE "public"."carts";

-- DropEnum
DROP TYPE "public"."DeliveryMethod";

-- DropEnum
DROP TYPE "public"."MainCategory";

-- DropEnum
DROP TYPE "public"."ProductStatus";

-- DropEnum
DROP TYPE "public"."SizeRange";

-- CreateIndex
CREATE INDEX "products_sales_status_idx" ON "products"("sales_status");

-- CreateIndex
CREATE INDEX "products_visibility_status_idx" ON "products"("visibility_status");

-- CreateIndex
CREATE INDEX "products_sale_price_idx" ON "products"("sale_price");
