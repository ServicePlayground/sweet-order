/*
  Warnings:

  - You are about to drop the column `is_verified` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[google_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."phone_verifications" ADD COLUMN     "purpose" TEXT NOT NULL DEFAULT 'registration',
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "is_verified",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "google_id" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_login_at" TIMESTAMP(3),
ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "public"."users"("google_id");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "public"."users"("phone");

-- CreateIndex
CREATE INDEX "users_user_id_idx" ON "public"."users"("user_id");

-- CreateIndex
CREATE INDEX "users_google_id_idx" ON "public"."users"("google_id");
