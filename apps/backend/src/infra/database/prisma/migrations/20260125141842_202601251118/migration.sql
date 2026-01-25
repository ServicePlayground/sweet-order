-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('BASIC_CAKE', 'CUSTOM_CAKE');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "product_type" "ProductType" NOT NULL DEFAULT 'BASIC_CAKE';
