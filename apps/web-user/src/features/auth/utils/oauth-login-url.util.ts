import { PATHS } from "@/apps/web-user/common/constants/paths.constant";

/**
 * 브라우저에서 카카오 OAuth 로그인 시작 URL (동일 도메인 redirect_uri)
 */
export function getKakaoOAuthLoginUrl(): string | null {
  if (typeof window === "undefined") return null;
  const clientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  if (!clientId) return null;
  const redirectUri = `${window.location.origin}${PATHS.AUTH.KAKAO_REDIRECT_URI}`;
  return `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
}

/**
 * 브라우저에서 구글 OAuth 로그인 시작 URL (동일 도메인 redirect_uri)
 */
export function getGoogleOAuthLoginUrl(): string | null {
  if (typeof window === "undefined") return null;
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) return null;
  const redirectUri = `${window.location.origin}${PATHS.AUTH.GOOGLE_REDIRECT_URI}`;
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email+profile&prompt=select_account`;
}
