import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "@/apps/web-seller/features/auth/store/auth.store";
import { authApi } from "@/apps/web-seller/features/auth/apis/auth.api";
import { authQueryKeys } from "@/apps/web-seller/features/auth/constants/authQueryKeys.constant";
import { useStoreList } from "@/apps/web-seller/features/store/hooks/queries/useStore";

// 현재 사용자 정보 조회 (새로고침 시 자동 실행)
export function useMe() {
  const { login, setInitialized } = useAuthStore();
  const { refetch: refetchStores } = useStoreList();

  const query = useQuery({
    queryKey: authQueryKeys.me,
    queryFn: authApi.me,
    throwOnError: false,
    refetchOnWindowFocus: true,
  });

  // 성공 시 스토어에 로그인 정보 저장
  useEffect(() => {
    if (query.isSuccess && query.data && "user" in query.data) {
      login(query.data.user);
      refetchStores(); // 로그인 성공 시 스토어 목록 조회 (기본적으로 비활성화되어 있음 - enabled: false)
    }
  }, [query.isSuccess, query.data, login, refetchStores]);

  // 쿼리 완료(성공/에러 모두) 시 초기화 완료 처리
  useEffect(() => {
    if (query.isSuccess || query.isError) {
      setInitialized(true);
    }
  }, [query.isSuccess, query.isError, setInitialized]);

  return query;
}

// 로그아웃 뮤테이션
export function useLogout() {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
    },
    onError: () => {
      // 에러가 발생해도 백엔드에서 쿠키를 삭제하므로 무시
      logout();
    },
  });
}
