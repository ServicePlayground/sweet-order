-- CreateEnum
CREATE TYPE "OptionRequired" AS ENUM ('REQUIRED', 'OPTIONAL');

-- CreateEnum
CREATE TYPE "EnableStatus" AS ENUM ('ENABLE', 'DISABLE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'SELLER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password_hash" TEXT,
    "name" TEXT,
    "nickname" TEXT,
    "email" TEXT,
    "profile_image_url" TEXT,
    "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "user_id" TEXT,
    "google_id" TEXT,
    "google_email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_verifications" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "verification_code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "purpose" TEXT NOT NULL DEFAULT 'registration',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "phone_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sale_price" INTEGER NOT NULL,
    "sales_status" "EnableStatus" NOT NULL,
    "visibility_status" "EnableStatus" NOT NULL,
    "cake_size_options" JSONB,
    "cake_flavor_options" JSONB,
    "lettering_visible" "EnableStatus" NOT NULL,
    "lettering_required" "OptionRequired" NOT NULL,
    "lettering_max_length" INTEGER NOT NULL,
    "image_upload_enabled" "EnableStatus" NOT NULL,
    "detail_description" TEXT,
    "product_number" TEXT NOT NULL,
    "product_notice_food_type" TEXT NOT NULL,
    "product_notice_producer" TEXT NOT NULL,
    "product_notice_origin" TEXT NOT NULL,
    "product_notice_address" TEXT NOT NULL,
    "product_notice_manufacture_date" TEXT NOT NULL,
    "product_notice_expiration_date" TEXT NOT NULL,
    "product_notice_package_capacity" TEXT NOT NULL,
    "product_notice_package_quantity" TEXT NOT NULL,
    "product_notice_ingredients" TEXT NOT NULL,
    "product_notice_calories" TEXT NOT NULL,
    "product_notice_safety_notice" TEXT NOT NULL,
    "product_notice_gmo_notice" TEXT NOT NULL,
    "product_notice_import_notice" TEXT NOT NULL,
    "product_notice_customer_service" TEXT NOT NULL,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_likes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "logo_image_url" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "business_no" TEXT NOT NULL,
    "representative_name" TEXT NOT NULL,
    "opening_date" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "business_sector" TEXT NOT NULL,
    "business_type" TEXT NOT NULL,
    "permission_management_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_id_key" ON "users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_user_id_idx" ON "users"("user_id");

-- CreateIndex
CREATE INDEX "users_google_id_idx" ON "users"("google_id");

-- CreateIndex
CREATE INDEX "products_store_id_idx" ON "products"("store_id");

-- CreateIndex
CREATE INDEX "products_sales_status_idx" ON "products"("sales_status");

-- CreateIndex
CREATE INDEX "products_visibility_status_idx" ON "products"("visibility_status");

-- CreateIndex
CREATE INDEX "products_created_at_idx" ON "products"("created_at");

-- CreateIndex
CREATE INDEX "products_sale_price_idx" ON "products"("sale_price");

-- CreateIndex
CREATE INDEX "products_like_count_idx" ON "products"("like_count");

-- CreateIndex
CREATE INDEX "products_name_idx" ON "products"("name");

-- CreateIndex
CREATE INDEX "product_likes_user_id_idx" ON "product_likes"("user_id");

-- CreateIndex
CREATE INDEX "product_likes_product_id_idx" ON "product_likes"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_likes_user_id_product_id_key" ON "product_likes"("user_id", "product_id");

-- CreateIndex
CREATE INDEX "stores_user_id_idx" ON "stores"("user_id");

-- CreateIndex
CREATE INDEX "stores_business_no_idx" ON "stores"("business_no");

-- CreateIndex
CREATE UNIQUE INDEX "stores_user_id_business_no_permission_management_number_key" ON "stores"("user_id", "business_no", "permission_management_number");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_likes" ADD CONSTRAINT "product_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_likes" ADD CONSTRAINT "product_likes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
