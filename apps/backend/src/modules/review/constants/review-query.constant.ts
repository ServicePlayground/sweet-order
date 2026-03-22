import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";

/**
 * 공개 노출·통계·내 후기 목록 등에 포함되는 후기 (사용자 소프트 삭제 제외)
 */
export const PRODUCT_REVIEW_ACTIVE_FILTER: Prisma.ProductReviewWhereInput = {
  deletedAt: null,
};
