import { useQuery } from "@tanstack/react-query";
import { mypageApi } from "@/apps/web-seller/features/mypage/apis/mypage.api";
import { mypageQueryKeys } from "@/apps/web-seller/features/mypage/constants/mypageQueryKeys.constant";
import type { SellerMypageProfileResponseDto } from "@/apps/web-seller/features/mypage/types/mypage.dto";
import { useAuthStore } from "@/apps/web-seller/features/auth/store/auth.store";

export function useMypageProfile() {
  const { isAuthenticated } = useAuthStore();

  return useQuery<SellerMypageProfileResponseDto>({
    queryKey: mypageQueryKeys.profile(),
    queryFn: () => mypageApi.getProfile(),
    enabled: isAuthenticated,
  });
}
