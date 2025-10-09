/*
  Warnings:

  - You are about to drop the `refresh_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."refresh_tokens" DROP CONSTRAINT "refresh_tokens_user_id_fkey";

-- DropTable
DROP TABLE "public"."refresh_tokens";


