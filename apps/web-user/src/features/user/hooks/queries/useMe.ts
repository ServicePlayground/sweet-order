import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/apps/web-user/features/user/apis/user.api";
import { UserProfile } from "@/apps/web-user/features/user/types/user.type";
import { useAuthStore } from "@/apps/web-user/common/store/auth.store";

export function useMe() {
  const { isAuthenticated } = useAuthStore();

  return useQuery<UserProfile>({
    queryKey: ["user", "me"],
    queryFn: userApi.getMe,
    enabled: isAuthenticated,
  });
}
