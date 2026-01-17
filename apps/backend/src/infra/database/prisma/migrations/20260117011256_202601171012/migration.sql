/*
  Warnings:

  - Added the required column `lettering_visible` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "lettering_visible" "EnableStatus" NOT NULL;
