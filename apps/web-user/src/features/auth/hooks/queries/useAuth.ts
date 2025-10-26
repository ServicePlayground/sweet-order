import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/apps/web-user/features/auth/store/auth.store";
import { authApi } from "@/apps/web-user/features/auth/apis/auth.api";
import { authQueryKeys } from "@/apps/web-user/features/auth/constants/authQueryKeys.constant";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { authClient } from "@/apps/web-user/common/config/axios.config";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";
import { AUTH_ERROR_MESSAGES } from "@/apps/web-user/features/auth/constants/auth.constant";

// 로그인 뮤테이션
export function useLogin() {
  const queryClient = useQueryClient();
  const { login } = useAuthStore();
  const { showAlert } = useAlertStore();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Zustand 스토어에 로그인 정보 저장 // 쿠키에는 토큰값 저장됨
      login(data.user, router);

      /**
       * 쿼리 캐시에 저장하는 이유
       * 1. 캐싱 관리: 동일한 데이터에 대한 중복 요청을 방지하고 캐시된 데이터를 재사용
       * 2. 무효화(Invalidation): 특정 데이터가 변경되었을 때 관련된 모든 쿼리를 자동으로 무효화
       * 3. 타입 안전성: TypeScript와 함께 사용하여 컴파일 타임에 오류 방지
       * 4. 중앙 집중 관리: 모든 쿼리키를 한 곳에서 관리하여 일관성 유지
       * 5. 디버깅: 쿼리 상태를 쉽게 추적하고 디버깅 가능
       */
      queryClient.setQueryData(authQueryKeys.me, data.user);
    },
    onError: (error) => {
      showAlert({
        type: "error",
        title: "오류",
        message: getApiMessage.error(error),
      });
    },
  });
}

// 회원가입 뮤테이션
export function useRegister() {
  const queryClient = useQueryClient();
  const { login } = useAuthStore();
  const { showAlert } = useAlertStore();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      // 회원가입 성공 시 자동 로그인 처리
      login(data.user, router);
      queryClient.setQueryData(authQueryKeys.me, data.user);
    },
    onError: (error) => {
      showAlert({
        type: "error",
        title: "오류",
        message: getApiMessage.error(error),
      });
    },
  });
}

// 현재 사용자 정보 조회 (새로고침 시 자동 실행)
export function useMe() {
  const { login, setInitialized } = useAuthStore();
  const router = useRouter();

  const query = useQuery({
    queryKey: authQueryKeys.me, // 자동으로 캐시 관리됨
    queryFn: authApi.me,
    throwOnError: false,
    refetchOnWindowFocus: true,
  });

  // 성공 시 스토어에 로그인 정보 저장
  useEffect(() => {
    if (query.isSuccess && query.data && "user" in query.data) {
      login(query.data.user, router);
    }
  }, [query.isSuccess, query.data, login]);

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
  const router = useRouter();

  return useMutation({
    mutationFn: async () => await authApi.logout(authClient),
    onSuccess: () => {
      // Zustand 스토어에서 로그아웃 상태로 변경
      logout(router);
    },
    onError: () => {
      // 에러가 발생해도 백엔드에서 쿠키를 삭제하므로 무시
      logout(router);
    },
  });
}

// ID 중복 검사 뮤테이션
export function useCheckUserIdDuplicate() {
  const { showAlert } = useAlertStore();

  return useMutation({
    mutationFn: authApi.checkUserIdDuplicate,
    onSuccess: (response) => {
      if (response.available) {
        showAlert({
          type: "success",
          title: "성공",
          message: AUTH_ERROR_MESSAGES.USER_ID_AVAILABLE,
        });
      } else {
        showAlert({
          type: "error",
          title: "오류",
          message: AUTH_ERROR_MESSAGES.USER_ID_ALREADY_EXISTS,
        });
      }
    },
    onError: (error) => {
      showAlert({
        type: "error",
        title: "오류",
        message: getApiMessage.error(error),
      });
    },
  });
}

// 휴대폰 인증번호 발송 뮤테이션
export function useSendPhoneVerification() {
  const { showAlert } = useAlertStore();

  return useMutation({
    mutationFn: authApi.sendPhoneVerification,
    onSuccess: (response) => {
      showAlert({
        type: "success",
        title: "성공",
        message: getApiMessage.success(response),
      });
    },
    onError: (error) => {
      showAlert({
        type: "error",
        title: "오류",
        message: getApiMessage.error(error),
      });
    },
  });
}

// 휴대폰 인증번호 검증 뮤테이션
export function useVerifyPhoneCode() {
  const { showAlert } = useAlertStore();

  return useMutation({
    mutationFn: authApi.verifyPhoneCode,
    onError: (error) => {
      showAlert({
        type: "error",
        title: "오류",
        message: getApiMessage.error(error),
      });
    },
  });
}

// 구글 로그인 뮤테이션
export function useGoogleLogin() {
  const queryClient = useQueryClient();
  const { login } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.googleLogin,
    onSuccess: (data) => {
      login(data.user, router);
      queryClient.setQueryData(authQueryKeys.me, data.user);
    },
    onError: (error) => {
      // 에러를 다시 throw하여 mutateAsync에서 catch할 수 있도록 함
      throw error;
    },
  });
}

// 구글 회원가입 뮤테이션
export function useGoogleRegister() {
  const queryClient = useQueryClient();
  const { login } = useAuthStore();
  const router = useRouter();
  const { showAlert } = useAlertStore();

  return useMutation({
    mutationFn: authApi.googleRegister,
    onSuccess: (data) => {
      login(data.user, router);
      queryClient.setQueryData(authQueryKeys.me, data.user);
    },
    onError: (error) => {
      showAlert({
        type: "error",
        title: "오류",
        message: getApiMessage.error(error),
      });
    },
  });
}

// 계정 찾기 뮤테이션
export function useFindAccount() {
  const { showAlert } = useAlertStore();

  return useMutation({
    mutationFn: authApi.findAccount,
    onError: (error) => {
      showAlert({
        type: "error",
        title: "오류",
        message: getApiMessage.error(error),
      });
    },
  });
}

// 비밀번호 재설정 뮤테이션
export function useResetPassword() {
  const { showAlert } = useAlertStore();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      router.push(PATHS.AUTH.LOGIN);
    },
    onError: (error) => {
      showAlert({
        type: "error",
        title: "오류",
        message: getApiMessage.error(error),
      });
    },
  });
}
