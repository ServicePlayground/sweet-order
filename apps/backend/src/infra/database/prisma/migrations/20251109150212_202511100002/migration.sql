/*
  Warnings:

  - You are about to drop the column `calories` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `customer_service` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `food_type` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `ingredients` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `manufacture_date` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `origin` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `package_info` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `producer` on the `products` table. All the data in the column will be lost.
  - Added the required column `product_notice_address` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_notice_calories` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_notice_customer_service` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_notice_expiration_date` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_notice_food_type` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_notice_gmo_notice` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_notice_import_notice` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_notice_ingredients` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_notice_manufacture_date` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_notice_origin` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_notice_package_capacity` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_notice_package_quantity` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_notice_producer` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_notice_safety_notice` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "calories",
DROP COLUMN "customer_service",
DROP COLUMN "food_type",
DROP COLUMN "ingredients",
DROP COLUMN "manufacture_date",
DROP COLUMN "origin",
DROP COLUMN "package_info",
DROP COLUMN "producer",
ADD COLUMN     "product_notice_address" TEXT NOT NULL,
ADD COLUMN     "product_notice_calories" TEXT NOT NULL,
ADD COLUMN     "product_notice_customer_service" TEXT NOT NULL,
ADD COLUMN     "product_notice_expiration_date" TEXT NOT NULL,
ADD COLUMN     "product_notice_food_type" TEXT NOT NULL,
ADD COLUMN     "product_notice_gmo_notice" TEXT NOT NULL,
ADD COLUMN     "product_notice_import_notice" TEXT NOT NULL,
ADD COLUMN     "product_notice_ingredients" TEXT NOT NULL,
ADD COLUMN     "product_notice_manufacture_date" TEXT NOT NULL,
ADD COLUMN     "product_notice_origin" TEXT NOT NULL,
ADD COLUMN     "product_notice_package_capacity" TEXT NOT NULL,
ADD COLUMN     "product_notice_package_quantity" TEXT NOT NULL,
ADD COLUMN     "product_notice_producer" TEXT NOT NULL,
ADD COLUMN     "product_notice_safety_notice" TEXT NOT NULL;
