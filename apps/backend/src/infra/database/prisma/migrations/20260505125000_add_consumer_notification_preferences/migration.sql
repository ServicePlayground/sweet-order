-- CreateTable
CREATE TABLE "consumer_notification_preferences" (
    "id" TEXT NOT NULL,
    "consumer_id" TEXT NOT NULL,
    "app_surface" "NotificationAppSurface" NOT NULL,
    "order_push_enabled" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consumer_notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "consumer_notification_preferences_consumer_id_app_surface_key" ON "consumer_notification_preferences"("consumer_id", "app_surface");

-- AddForeignKey
ALTER TABLE "consumer_notification_preferences" ADD CONSTRAINT "consumer_notification_preferences_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
