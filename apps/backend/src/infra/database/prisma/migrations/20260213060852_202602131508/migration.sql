-- CreateEnum
CREATE TYPE "ProductCategoryType" AS ENUM ('BIRTHDAY', 'LOVER', 'FRIEND', 'FAMILY', 'ANNIVERSARY', 'SAME_DAY_PICKUP', 'LETTERING', 'CHARACTER', 'SIMPLE', 'FLOWER', 'PHOTO');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "product_category_types" "ProductCategoryType"[] DEFAULT ARRAY[]::"ProductCategoryType"[];
