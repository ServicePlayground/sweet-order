/**
 * returnUrl 관련 유틸리티 함수들
 *
 * 판매자페이지에서 인증이 필요할 때 무조건 web-user의 /auth/login 경로로 리다이렉트되도록 처리하였음
 * 리다이렉트 유지는 "일반 로그인", "구글 로그인" 버튼 클릭 시에만 이루어짐
 */

/**
 * 현재 URL에서 returnUrl 파라미터를 가져옵니다.
 */
export const getReturnUrl = (): string | null => {
  if (typeof window === "undefined") return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("returnUrl");
};

/**
 * returnUrl을 포함한 새로운 URL을 생성합니다.
 * @param basePath - 기본 경로 (예: 'auth/login/basic')
 * @param returnUrl - 리턴할 URL (없으면 현재 URL에서 가져옴)
 */
export const createUrlWithReturnUrl = (basePath: string, returnUrl?: string): string => {
  const targetReturnUrl = returnUrl || getReturnUrl();

  if (targetReturnUrl) {
    return `${basePath}?returnUrl=${encodeURIComponent(targetReturnUrl)}`;
  }

  return basePath;
};

/**
 * 구글 OAuth URL에 returnUrl을 state 파라미터로 추가합니다.
 * @param baseOAuthUrl - 기본 구글 OAuth URL
 * @param returnUrl - 리턴할 URL (없으면 현재 URL에서 가져옴)
 */
export const createGoogleOAuthUrlWithReturnUrl = (
  baseOAuthUrl: string,
  returnUrl?: string,
): string => {
  const targetReturnUrl = returnUrl || getReturnUrl();

  if (targetReturnUrl) {
    return `${baseOAuthUrl}&state=${encodeURIComponent(targetReturnUrl)}`;
  }

  return baseOAuthUrl;
};

/**
 * returnUrl 또는 state 파라미터에서 실제 리턴할 URL을 가져옵니다.
 * @param searchParams - URLSearchParams 객체
 */
export const getReturnUrlFromParams = (searchParams: URLSearchParams): string | null => {
  const returnUrl = searchParams.get("returnUrl");
  const stateReturnUrl = searchParams.get("state"); // 구글 로그인 시 전달된 returnUrl

  return returnUrl || stateReturnUrl;
};

/**
 * returnUrl이 있으면 해당 URL로 리다이렉트하고, 없으면 기본 경로로 이동합니다.
 * @param searchParams - URLSearchParams 객체
 * @param defaultPath - returnUrl이 없을 때 이동할 기본 경로
 * @param router - Next.js router 객체 (선택사항)
 */
export const handleReturnUrlRedirect = (
  searchParams: URLSearchParams,
  defaultPath: string,
  router?: any,
): void => {
  const returnUrl = getReturnUrlFromParams(searchParams);

  if (returnUrl) {
    // web-seller에서 전달된 절대 경로로 리다이렉트
    window.location.href = decodeURIComponent(returnUrl);
  } else if (router) {
    router.push(defaultPath);
  } else {
    window.location.href = defaultPath;
  }
};
