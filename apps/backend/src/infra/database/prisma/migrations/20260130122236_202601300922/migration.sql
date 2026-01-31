/*
  Warnings:

  - You are about to alter the column `last_message` on the `chat_rooms` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.

*/
-- CreateEnum
CREATE TYPE "MessageSenderType" AS ENUM ('USER', 'STORE');

-- DropIndex
DROP INDEX "public"."chat_rooms_last_message_at_idx";

-- AlterTable
ALTER TABLE "chat_rooms" ALTER COLUMN "last_message" SET DATA TYPE VARCHAR(1000);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "sender_type" "MessageSenderType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "messages_room_id_created_at_idx" ON "messages"("room_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "messages_room_id_idx" ON "messages"("room_id");

-- CreateIndex
CREATE INDEX "chat_rooms_user_id_last_message_at_idx" ON "chat_rooms"("user_id", "last_message_at" DESC);

-- CreateIndex
CREATE INDEX "chat_rooms_store_id_last_message_at_idx" ON "chat_rooms"("store_id", "last_message_at" DESC);

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
