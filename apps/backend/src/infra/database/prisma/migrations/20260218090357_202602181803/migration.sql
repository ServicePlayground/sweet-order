/*
  Warnings:

  - Made the column `pickup_address` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pickup_road_address` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pickup_zonecode` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pickup_latitude` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pickup_longitude` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "pickup_detail_address" TEXT,
ALTER COLUMN "pickup_address" SET NOT NULL,
ALTER COLUMN "pickup_road_address" SET NOT NULL,
ALTER COLUMN "pickup_zonecode" SET NOT NULL,
ALTER COLUMN "pickup_latitude" SET NOT NULL,
ALTER COLUMN "pickup_longitude" SET NOT NULL;

-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "detailAddress" TEXT;
