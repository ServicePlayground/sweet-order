-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "order_number" TEXT NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "pickup_address" TEXT NOT NULL,
    "pickup_road_address" TEXT NOT NULL,
    "pickup_zonecode" TEXT NOT NULL,
    "pickup_latitude" DOUBLE PRECISION NOT NULL,
    "pickup_longitude" DOUBLE PRECISION NOT NULL,
    "order_status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "pickup_date" TIMESTAMP(3) NOT NULL,
    "size_id" TEXT,
    "size_display_name" TEXT,
    "size_length_cm" INTEGER,
    "size_description" TEXT,
    "size_price" INTEGER,
    "flavor_id" TEXT,
    "flavor_display_name" TEXT,
    "flavor_price" INTEGER,
    "lettering_message" VARCHAR(500),
    "request_message" TEXT,
    "quantity" INTEGER NOT NULL,
    "item_price" INTEGER NOT NULL,
    "image_urls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX "orders_user_id_created_at_idx" ON "orders"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "orders_store_id_created_at_idx" ON "orders"("store_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "orders_product_id_idx" ON "orders"("product_id");

-- CreateIndex
CREATE INDEX "orders_order_status_idx" ON "orders"("order_status");

-- CreateIndex
CREATE INDEX "orders_order_number_idx" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX "orders_pickup_latitude_pickup_longitude_idx" ON "orders"("pickup_latitude", "pickup_longitude");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
