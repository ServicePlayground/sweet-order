/*
  Warnings:

  - You are about to drop the column `user_id` on the `phone_verifications` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."phone_verifications_phone_verification_code_key";

-- AlterTable
ALTER TABLE "phone_verifications" DROP COLUMN "user_id";
