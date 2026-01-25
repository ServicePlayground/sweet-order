-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "like_count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "store_likes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "store_likes_user_id_idx" ON "store_likes"("user_id");

-- CreateIndex
CREATE INDEX "store_likes_store_id_idx" ON "store_likes"("store_id");

-- CreateIndex
CREATE UNIQUE INDEX "store_likes_user_id_store_id_key" ON "store_likes"("user_id", "store_id");

-- CreateIndex
CREATE INDEX "stores_like_count_idx" ON "stores"("like_count");

-- AddForeignKey
ALTER TABLE "store_likes" ADD CONSTRAINT "store_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_likes" ADD CONSTRAINT "store_likes_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
