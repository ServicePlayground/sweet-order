-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "product_images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "product_name" TEXT;
