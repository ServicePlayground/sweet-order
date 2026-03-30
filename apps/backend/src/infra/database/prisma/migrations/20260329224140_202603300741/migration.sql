-- CreateEnum
CREATE TYPE "NotificationAppSurface" AS ENUM ('SELLER_WEB', 'USER_WEB');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('ORDER');

-- CreateTable
CREATE TABLE "user_notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "app_surface" "NotificationAppSurface" NOT NULL,
    "category" "NotificationCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read_at" TIMESTAMP(3),
    "store_id" TEXT,
    "order_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notification_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "app_surface" "NotificationAppSurface" NOT NULL,
    "order_notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
    "order_notification_sound_enabled" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_notifications_user_id_app_surface_store_id_created_at_idx" ON "user_notifications"("user_id", "app_surface", "store_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "user_notifications_user_id_app_surface_read_at_idx" ON "user_notifications"("user_id", "app_surface", "read_at");

-- CreateIndex
CREATE INDEX "user_notification_preferences_store_id_idx" ON "user_notification_preferences"("store_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_notification_preferences_user_id_app_surface_store_id_key" ON "user_notification_preferences"("user_id", "app_surface", "store_id");

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notification_preferences" ADD CONSTRAINT "user_notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notification_preferences" ADD CONSTRAINT "user_notification_preferences_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
