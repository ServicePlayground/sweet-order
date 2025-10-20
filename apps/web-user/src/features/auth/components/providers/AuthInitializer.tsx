"use client";

import { useMe } from "@/apps/web-user/features/auth/hooks/queries/useAuth";

/**
 * 앱 초기화 시 사용자 인증 상태를 확인하는 AuthInitializerProvider
 * - 새로고침 시 자동으로 사용자 정보 조회
 * - 토큰이 유효하면 스토어에 로그인 정보 저장
 * - 토큰이 없거나 만료되면 자동으로 로그아웃 상태 유지
 */
export function AuthInitializerProvider() {
  // 사용자 정보 조회 (새로고침 시 자동 실행)
  useMe();

  return <></>;
}
