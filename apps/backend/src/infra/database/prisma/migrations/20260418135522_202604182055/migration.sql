/*
  Warnings:

  - The values [USER] on the enum `MessageSenderType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `user_id` on the `chat_rooms` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `product_likes` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `product_recent_views` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `product_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `store_likes` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `user_notification_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `user_notifications` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[consumer_id,store_id]` on the table `chat_rooms` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[consumer_id,product_id]` on the table `product_likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[consumer_id,product_id]` on the table `product_recent_views` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[consumer_id,store_id]` on the table `store_likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seller_id,business_no,permission_management_number]` on the table `stores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seller_id,app_surface,store_id]` on the table `user_notification_preferences` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `consumer_id` to the `chat_rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consumer_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consumer_id` to the `product_likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consumer_id` to the `product_recent_views` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consumer_id` to the `product_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consumer_id` to the `store_likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_id` to the `stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_id` to the `user_notification_preferences` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SellerVerificationStatus" AS ENUM ('REGISTERED', 'BUSINESS_VERIFIED');

-- AlterEnum
BEGIN;
CREATE TYPE "MessageSenderType_new" AS ENUM ('CONSUMER', 'STORE');
ALTER TABLE "messages" ALTER COLUMN "sender_type" TYPE "MessageSenderType_new" USING ("sender_type"::text::"MessageSenderType_new");
ALTER TYPE "MessageSenderType" RENAME TO "MessageSenderType_old";
ALTER TYPE "MessageSenderType_new" RENAME TO "MessageSenderType";
DROP TYPE "public"."MessageSenderType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."chat_rooms" DROP CONSTRAINT "chat_rooms_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_likes" DROP CONSTRAINT "product_likes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_recent_views" DROP CONSTRAINT "product_recent_views_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_reviews" DROP CONSTRAINT "product_reviews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."store_likes" DROP CONSTRAINT "store_likes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."stores" DROP CONSTRAINT "stores_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_notification_preferences" DROP CONSTRAINT "user_notification_preferences_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_notifications" DROP CONSTRAINT "user_notifications_user_id_fkey";

-- DropIndex
DROP INDEX "public"."chat_rooms_user_id_idx";

-- DropIndex
DROP INDEX "public"."chat_rooms_user_id_last_message_at_idx";

-- DropIndex
DROP INDEX "public"."chat_rooms_user_id_store_id_key";

-- DropIndex
DROP INDEX "public"."orders_user_id_created_at_idx";

-- DropIndex
DROP INDEX "public"."product_likes_user_id_idx";

-- DropIndex
DROP INDEX "public"."product_likes_user_id_product_id_key";

-- DropIndex
DROP INDEX "public"."product_recent_views_user_id_product_id_key";

-- DropIndex
DROP INDEX "public"."product_recent_views_user_id_viewed_at_idx";

-- DropIndex
DROP INDEX "public"."product_reviews_user_id_idx";

-- DropIndex
DROP INDEX "public"."store_likes_user_id_idx";

-- DropIndex
DROP INDEX "public"."store_likes_user_id_store_id_key";

-- DropIndex
DROP INDEX "public"."stores_user_id_business_no_permission_management_number_key";

-- DropIndex
DROP INDEX "public"."stores_user_id_idx";

-- DropIndex
DROP INDEX "public"."user_notification_preferences_user_id_app_surface_store_id_key";

-- DropIndex
DROP INDEX "public"."user_notifications_user_id_app_surface_read_at_idx";

-- DropIndex
DROP INDEX "public"."user_notifications_user_id_app_surface_store_id_created_at_idx";

-- AlterTable
ALTER TABLE "chat_rooms" DROP COLUMN "user_id",
ADD COLUMN     "consumer_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "user_id",
ADD COLUMN     "consumer_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product_likes" DROP COLUMN "user_id",
ADD COLUMN     "consumer_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product_recent_views" DROP COLUMN "user_id",
ADD COLUMN     "consumer_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product_reviews" DROP COLUMN "user_id",
ADD COLUMN     "consumer_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "store_likes" DROP COLUMN "user_id",
ADD COLUMN     "consumer_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "user_id",
ADD COLUMN     "seller_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_notification_preferences" DROP COLUMN "user_id",
ADD COLUMN     "seller_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_notifications" DROP COLUMN "user_id",
ADD COLUMN     "consumer_id" TEXT,
ADD COLUMN     "seller_id" TEXT;

-- DropTable
DROP TABLE "public"."users";

-- DropEnum
DROP TYPE "public"."UserRole";

-- CreateTable
CREATE TABLE "consumers" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT,
    "nickname" TEXT,
    "profile_image_url" TEXT,
    "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "google_id" TEXT,
    "google_email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "consumers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sellers" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT,
    "nickname" TEXT,
    "profile_image_url" TEXT,
    "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "google_id" TEXT,
    "google_email" TEXT,
    "seller_verification_status" "SellerVerificationStatus" NOT NULL DEFAULT 'REGISTERED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "sellers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "consumers_phone_key" ON "consumers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "consumers_google_id_key" ON "consumers"("google_id");

-- CreateIndex
CREATE INDEX "consumers_phone_idx" ON "consumers"("phone");

-- CreateIndex
CREATE INDEX "consumers_google_id_idx" ON "consumers"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_phone_key" ON "sellers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_google_id_key" ON "sellers"("google_id");

-- CreateIndex
CREATE INDEX "sellers_phone_idx" ON "sellers"("phone");

-- CreateIndex
CREATE INDEX "sellers_google_id_idx" ON "sellers"("google_id");

-- CreateIndex
CREATE INDEX "chat_rooms_consumer_id_last_message_at_idx" ON "chat_rooms"("consumer_id", "last_message_at" DESC);

-- CreateIndex
CREATE INDEX "chat_rooms_consumer_id_idx" ON "chat_rooms"("consumer_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_rooms_consumer_id_store_id_key" ON "chat_rooms"("consumer_id", "store_id");

-- CreateIndex
CREATE INDEX "orders_consumer_id_created_at_idx" ON "orders"("consumer_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "product_likes_consumer_id_idx" ON "product_likes"("consumer_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_likes_consumer_id_product_id_key" ON "product_likes"("consumer_id", "product_id");

-- CreateIndex
CREATE INDEX "product_recent_views_consumer_id_viewed_at_idx" ON "product_recent_views"("consumer_id", "viewed_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "product_recent_views_consumer_id_product_id_key" ON "product_recent_views"("consumer_id", "product_id");

-- CreateIndex
CREATE INDEX "product_reviews_consumer_id_idx" ON "product_reviews"("consumer_id");

-- CreateIndex
CREATE INDEX "store_likes_consumer_id_idx" ON "store_likes"("consumer_id");

-- CreateIndex
CREATE UNIQUE INDEX "store_likes_consumer_id_store_id_key" ON "store_likes"("consumer_id", "store_id");

-- CreateIndex
CREATE INDEX "stores_seller_id_idx" ON "stores"("seller_id");

-- CreateIndex
CREATE UNIQUE INDEX "stores_seller_id_business_no_permission_management_number_key" ON "stores"("seller_id", "business_no", "permission_management_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_notification_preferences_seller_id_app_surface_store_i_key" ON "user_notification_preferences"("seller_id", "app_surface", "store_id");

-- CreateIndex
CREATE INDEX "user_notifications_consumer_id_app_surface_store_id_created_idx" ON "user_notifications"("consumer_id", "app_surface", "store_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "user_notifications_seller_id_app_surface_store_id_created_a_idx" ON "user_notifications"("seller_id", "app_surface", "store_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "user_notifications_consumer_id_app_surface_read_at_idx" ON "user_notifications"("consumer_id", "app_surface", "read_at");

-- CreateIndex
CREATE INDEX "user_notifications_seller_id_app_surface_read_at_idx" ON "user_notifications"("seller_id", "app_surface", "read_at");

-- AddForeignKey
ALTER TABLE "product_likes" ADD CONSTRAINT "product_likes_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_recent_views" ADD CONSTRAINT "product_recent_views_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_likes" ADD CONSTRAINT "store_likes_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notification_preferences" ADD CONSTRAINT "user_notification_preferences_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
