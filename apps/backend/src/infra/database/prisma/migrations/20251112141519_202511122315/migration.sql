/*
  Warnings:

  - Made the column `delivery_method` on table `carts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "carts" ALTER COLUMN "delivery_method" SET NOT NULL;
