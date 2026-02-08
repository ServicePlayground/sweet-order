-- CreateTable
CREATE TABLE "store_feeds" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_feeds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "store_feeds_store_id_idx" ON "store_feeds"("store_id");

-- CreateIndex
CREATE INDEX "store_feeds_created_at_idx" ON "store_feeds"("created_at");

-- AddForeignKey
ALTER TABLE "store_feeds" ADD CONSTRAINT "store_feeds_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
