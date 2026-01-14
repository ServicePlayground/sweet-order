/*
  Warnings:

  - You are about to drop the column `additional_images` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `main_image` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "additional_images",
DROP COLUMN "main_image",
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
