-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "pickup_address" DROP NOT NULL,
ALTER COLUMN "pickup_road_address" DROP NOT NULL,
ALTER COLUMN "pickup_zonecode" DROP NOT NULL,
ALTER COLUMN "pickup_latitude" DROP NOT NULL,
ALTER COLUMN "pickup_longitude" DROP NOT NULL;

-- AlterTable
ALTER TABLE "stores" ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL,
ALTER COLUMN "roadAddress" DROP NOT NULL,
ALTER COLUMN "zonecode" DROP NOT NULL;
