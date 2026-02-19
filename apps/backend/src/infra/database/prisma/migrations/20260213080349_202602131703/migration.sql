-- AlterTable
ALTER TABLE "products" ADD COLUMN     "search_tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
