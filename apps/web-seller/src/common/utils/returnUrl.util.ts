/**
 * returnUrl 관련 유틸리티 함수들 (web-seller용)
 */

/**
 * web-seller에서 web-user로 리다이렉트할 때 사용하는 URL을 생성합니다.
 * @param userDomain - web-user 도메인
 */
export const createSellerToUserRedirectUrl = (userDomain: string): string => {
  const currentPath = window.location.pathname + window.location.search;
  const fullReturnUrl = window.location.origin + currentPath;
  const returnUrl = encodeURIComponent(fullReturnUrl);
  return `${userDomain}/auth/login?returnUrl=${returnUrl}`;
};
