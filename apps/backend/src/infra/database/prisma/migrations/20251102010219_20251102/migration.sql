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
    "business_status" TEXT,
    "business_status_code" TEXT,
    "tax_type" TEXT,
    "tax_type_code" TEXT,
    "close_date" TEXT,
    "permission_management_number" TEXT NOT NULL,
    "online_trading_company_detail" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stores_user_id_key" ON "stores"("user_id");

-- CreateIndex
CREATE INDEX "stores_user_id_idx" ON "stores"("user_id");

-- CreateIndex
CREATE INDEX "stores_business_no_idx" ON "stores"("business_no");

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
