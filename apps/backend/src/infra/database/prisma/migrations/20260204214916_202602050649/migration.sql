/*
  Warnings:

  - Added the required column `zonecode` to the `stores` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `stores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `latitude` on table `stores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `stores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `roadAddress` on table `stores` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "zonecode" TEXT NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "longitude" SET NOT NULL,
ALTER COLUMN "roadAddress" SET NOT NULL;
