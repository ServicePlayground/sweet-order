import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/apps/web-user/features/store/apis/store.api";

export function useStoreRegions() {
  return useQuery({
    queryKey: ["store", "regions"],
    queryFn: storeApi.getRegions,
    staleTime: 1000 * 60 * 10, // 10분 캐시
  });
}
