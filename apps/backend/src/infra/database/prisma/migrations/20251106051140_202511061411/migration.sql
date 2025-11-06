/*
  Warnings:

  - The values [PRODUCT] on the enum `MainCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `sub_category` on the `products` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MainCategory_new" AS ENUM ('CAKE', 'SUPPLY', 'OTHER');
ALTER TABLE "products" ALTER COLUMN "main_category" TYPE "MainCategory_new" USING ("main_category"::text::"MainCategory_new");
ALTER TYPE "MainCategory" RENAME TO "MainCategory_old";
ALTER TYPE "MainCategory_new" RENAME TO "MainCategory";
DROP TYPE "public"."MainCategory_old";
COMMIT;

-- DropIndex
DROP INDEX "public"."products_sub_category_idx";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "sub_category",
ALTER COLUMN "main_category" SET NOT NULL,
ALTER COLUMN "main_category" SET DATA TYPE "MainCategory";

-- DropEnum
DROP TYPE "public"."SubCategory";
