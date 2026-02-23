import type { OrderListRequestDto } from "@/apps/web-seller/features/order/types/order.dto";

/** 쿼리 키/옵션용 (page 제외, 클라이언트 전용) */
export type OrderListQueryParams = Omit<OrderListRequestDto, "page">;
