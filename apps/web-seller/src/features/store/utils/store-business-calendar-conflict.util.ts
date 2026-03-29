/**
 * PUT business-calendar 409 응답에서 확정 예약 충돌 건수를 꺼냄.
 * 백엔드 ErrorResponseInterceptor: { success, data: { message, conflictingOrderNumbers } }
 */
export function getBusinessCalendarConflictOrderCount(error: unknown): number | null {
  const ax = error as {
    response?: {
      status?: number;
      data?: { data?: { conflictingOrderNumbers?: string[] } };
    };
  };
  if (ax.response?.status !== 409) return null;
  const nums = ax.response.data?.data?.conflictingOrderNumbers;
  if (!Array.isArray(nums) || nums.length === 0) return null;
  return nums.length;
}
