import { useMe } from "@/apps/web-seller/features/auth/hooks/useAuth";
import { useAuthStore } from "@/apps/web-seller/features/auth/store/auth.store";
import { LoadingFallback } from "@/apps/web-seller/common/components/fallbacks/LoadingFallback";

interface AuthInitializerProviderProps {
  children: React.ReactNode;
}

/**
 * 앱 초기화 시 사용자 인증 상태를 확인하는 AuthInitializerProvider
 * - 새로고침 시 자동으로 사용자 정보 조회
 * - 토큰이 유효하면 스토어에 로그인 정보 저장
 * - 토큰이 없거나 만료되면 자동으로 로그아웃 상태 유지
 * - 초기화 완료 전까지는 로딩 화면 표시
 */
export function AuthInitializerProvider({ children }: AuthInitializerProviderProps) {
  useMe(); // 사용자 정보 조회 (새로고침 시 자동 실행)
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <>{children}</>;
  }

  // 초기화가 완료되고 인증되지 않았으면 로딩 표시
  return <LoadingFallback message="인증 확인 중..." />;
}
