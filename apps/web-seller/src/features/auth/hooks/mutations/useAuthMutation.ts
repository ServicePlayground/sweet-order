import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/apps/web-seller/features/auth/store/auth.store";
import { authApi } from "@/apps/web-seller/features/auth/apis/auth.api";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import { AUTH_ERROR_MESSAGES } from "@/apps/web-seller/features/auth/constants/auth.constant";
import { PhoneVerificationPurpose } from "@/apps/web-seller/features/auth/types/auth.type";

// 로그인 뮤테이션
export function useLogin() {
  const { login } = useAuthStore();
  const { addAlert } = useAlertStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login({ navigate, accessToken: data.accessToken });
    },
    onError: (error) => {
      addAlert({
        message: getApiMessage.error(error),
        title: "오류",
        severity: "error",
      });
    },
  });
}

// 회원가입 뮤테이션
export function useRegister() {
  const { login } = useAuthStore();
  const { addAlert } = useAlertStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      login({ navigate, accessToken: data.accessToken });
    },
    onError: (error) => {
      addAlert({
        message: getApiMessage.error(error),
        title: "오류",
        severity: "error",
      });
    },
  });
}

// 로그아웃 뮤테이션 (백엔드 API가 없으므로 로컬에서만 처리, isPending 상태를 위해 useMutation 유지)
export function useLogout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      // 백엔드에 로그아웃 API가 없으므로 즉시 완료
      return Promise.resolve();
    },
    onSuccess: () => {
      logout(navigate);
    },
  });
}

// ID 중복 검사 뮤테이션
export function useCheckUserIdDuplicate() {
  const { addAlert } = useAlertStore();

  return useMutation({
    mutationFn: authApi.checkUserIdDuplicate,
    onSuccess: (response) => {
      if (response.available) {
        addAlert({
          message: AUTH_ERROR_MESSAGES.USER_ID_AVAILABLE,
          title: "성공",
          severity: "success",
        });
      } else {
        addAlert({
          message: AUTH_ERROR_MESSAGES.USER_ID_ALREADY_EXISTS,
          title: "오류",
          severity: "error",
        });
      }
    },
    onError: (error) => {
      addAlert({
        message: getApiMessage.error(error),
        title: "오류",
        severity: "error",
      });
    },
  });
}

// 휴대폰 인증번호 발송 뮤테이션
export function useSendPhoneVerification() {
  const { addAlert } = useAlertStore();

  return useMutation({
    mutationFn: ({ phone, purpose }: { phone: string; purpose: PhoneVerificationPurpose }) =>
      authApi.sendPhoneVerification(phone, purpose),
    onSuccess: (response) => {
      addAlert({
        message: getApiMessage.success(response),
        title: "성공",
        severity: "success",
      });
    },
    onError: (error) => {
      addAlert({
        message: getApiMessage.error(error),
        title: "오류",
        severity: "error",
      });
    },
  });
}

// 휴대폰 인증번호 검증 뮤테이션
export function useVerifyPhoneCode() {
  const { addAlert } = useAlertStore();

  return useMutation({
    mutationFn: authApi.verifyPhoneCode,
    onError: (error) => {
      addAlert({
        message: getApiMessage.error(error),
        title: "오류",
        severity: "error",
      });
    },
  });
}

// 구글 로그인 뮤테이션
export function useGoogleLogin() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.googleLogin,
    onSuccess: (data) => {
      login({ navigate, accessToken: data.accessToken });
    },
    onError: (error) => {
      // 에러를 다시 throw하여 mutateAsync에서 catch할 수 있도록 함
      throw error;
    },
  });
}

// 구글 회원가입 뮤테이션
export function useGoogleRegister() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { addAlert } = useAlertStore();

  return useMutation({
    mutationFn: authApi.googleRegister,
    onSuccess: (data) => {
      login({ navigate, accessToken: data.accessToken });
    },
    onError: (error) => {
      addAlert({
        message: getApiMessage.error(error),
        title: "오류",
        severity: "error",
      });
    },
  });
}

// 계정 찾기 뮤테이션
export function useFindAccount() {
  const { addAlert } = useAlertStore();

  return useMutation({
    mutationFn: authApi.findAccount,
    onError: (error) => {
      addAlert({
        message: getApiMessage.error(error),
        title: "오류",
        severity: "error",
      });
    },
  });
}

// 비밀번호 재설정 뮤테이션
export function useResetPassword() {
  const { addAlert } = useAlertStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      navigate(ROUTES.ROOT);
    },
    onError: (error) => {
      addAlert({
        message: getApiMessage.error(error),
        title: "오류",
        severity: "error",
      });
    },
  });
}
