-- CreateTable
CREATE TABLE "consumer_fcm_tokens" (
    "id" TEXT NOT NULL,
    "consumer_id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consumer_fcm_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "consumer_fcm_tokens_token_key" ON "consumer_fcm_tokens"("token");

-- CreateIndex
CREATE INDEX "consumer_fcm_tokens_consumer_id_idx" ON "consumer_fcm_tokens"("consumer_id");

-- CreateIndex
CREATE UNIQUE INDEX "consumer_fcm_tokens_consumer_id_device_id_key" ON "consumer_fcm_tokens"("consumer_id", "device_id");

-- AddForeignKey
ALTER TABLE "consumer_fcm_tokens" ADD CONSTRAINT "consumer_fcm_tokens_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
