-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'SELLER', 'ADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
