-- CreateEnum
CREATE TYPE "StoreBankName" AS ENUM ('NH_NONGHYUP', 'KAKAO_BANK', 'KB_KOOKMIN', 'TOSS_BANK', 'SHINHAN', 'WOORI', 'IBK', 'HANA', 'SAEMAEUL', 'BUSAN', 'IM_BANK_DAEGU', 'K_BANK', 'SINHYEOP', 'POST_OFFICE', 'SC_JEIL', 'KYONGNAM', 'GWANGJU', 'SUHYUP', 'JEONBUK', 'SAVINGS_BANK', 'JEJU', 'CITI', 'KDB');

-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "account_holder_name" TEXT,
ADD COLUMN     "bank_account_number" TEXT,
ADD COLUMN     "bank_name" "StoreBankName";
