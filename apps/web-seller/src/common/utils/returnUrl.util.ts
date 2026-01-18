/**
 * returnUrl 관련 유틸리티 함수들
 *
 * 판매자페이지에서 인증이 필요할 때 무조건 web-user의 /auth/login 경로로 리다이렉트되도록 처리하였음
 * 리다이렉트 유지는 "일반 로그인", "구글 로그인" 버튼 클릭 시에만 이루어짐
 */

/**
 * 현재 주소(도메인 + path + 쿼리스트링)를 returnUrl로 포함하여 /auth/login으로 리다이렉트합니다.
 * 단, 이미 로그인 페이지에 있으면 리다이렉트하지 않습니다 (무한루프 방지).
 * @param loginPath - 로그인 페이지 경로 (기본값: '/auth/login')
 */
export const redirectToLoginWithCurrentUrl = (loginPath: string = "/auth/login"): void => {
  // 이미 로그인 페이지에 있으면 리다이렉트하지 않음 (axios interceptor에서 무한루프 방지)
  if (window.location.pathname.startsWith("/auth")) {
    return;
  }

  const currentPath = window.location.pathname + window.location.search;
  const fullReturnUrl = window.location.origin + currentPath;
  const returnUrl = encodeURIComponent(fullReturnUrl);
  window.location.href = `${loginPath}?returnUrl=${returnUrl}`;
};

/**
 * returnUrl을 유지한채로 새로운 URL을 생성합니다.
 * @param basePath - 기본 경로 (예: 'auth/login/basic')
 * @param returnUrl - 리턴할 URL (없으면 파라미터 추가 안 함)
 */
export const createUrlWithReturnUrl = (basePath: string, returnUrl?: string): string => {
  if (returnUrl) {
    return `${basePath}?returnUrl=${encodeURIComponent(returnUrl)}`;
  }
  return basePath;
};

/**
 * 구글 OAuth URL에 returnUrl을 state 파라미터로 추가하여 새로운 URL을 생성합니다.
 * @param baseOAuthUrl - 기본 구글 OAuth URL
 * @param returnUrl - 리턴할 URL (없으면 파라미터 추가 안 함)
 */
export const createGoogleOAuthUrlWithReturnUrl = (
  baseOAuthUrl: string,
  returnUrl?: string,
): string => {
  if (returnUrl) {
    return `${baseOAuthUrl}&state=${encodeURIComponent(returnUrl)}`;
  }
  return baseOAuthUrl;
};

/**
 * returnUrl 또는 state 파라미터에서 실제 리턴할 URL을 가져옵니다.
 * searchParams가 제공되지 않으면 현재 URL의 search를 사용합니다.
 * @param searchParams - URLSearchParams 객체 (선택사항)
 * @returns returnUrl 또는 state 값, 없으면 null
 */
export const getReturnUrlFromParams = (searchParams: URLSearchParams): string | null => {
  if (typeof window === "undefined") return null;

  const params = searchParams || new URLSearchParams(window.location.search);
  const returnUrl = params.get("returnUrl");
  const stateReturnUrl = params.get("state"); // 구글 로그인 시 전달된 returnUrl

  return returnUrl || stateReturnUrl;
};
