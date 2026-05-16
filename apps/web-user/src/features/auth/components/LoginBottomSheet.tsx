"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DragHandleBottomSheet } from "@/apps/web-user/common/components/bottom-sheets/DragHandleBottomSheet";
import {
  oauthGoogleLoginButtonClassName,
  oauthKakaoLoginButtonClassName,
  oauthLoginButtonIconClassName,
} from "@/apps/web-user/common/components/buttons/oauth-provider-login-buttons";
import {
  getGoogleOAuthLoginUrl,
  getKakaoOAuthLoginUrl,
} from "@/apps/web-user/features/auth/utils/oauth-login-url.util";

interface LoginBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 비로그인 사용자에게 노출되는 로그인 / 회원가입 바텀시트.
 * 카카오·구글 OAuth 시작 버튼 노출.
 */
export function LoginBottomSheet({ isOpen, onClose }: LoginBottomSheetProps) {
  const [googleAuthHref, setGoogleAuthHref] = useState<string | null>(null);
  const [kakaoAuthHref, setKakaoAuthHref] = useState<string | null>(null);

  useEffect(() => {
    setGoogleAuthHref(getGoogleOAuthLoginUrl());
    setKakaoAuthHref(getKakaoOAuthLoginUrl());
  }, []);

  return (
    <DragHandleBottomSheet isOpen={isOpen} onClose={onClose} draggable={false}>
      <div className="px-5 py-4">
        <h2 className="text-xl font-bold text-gray-900">로그인 / 회원가입 하기</h2>
        <p className="mt-2 text-sm text-gray-500">픽케이크에서 케이크 예약을 쉽고 빠르게</p>

        <div className="mt-14 flex flex-col gap-3">
          {kakaoAuthHref && (
            <a href={kakaoAuthHref} className={oauthKakaoLoginButtonClassName}>
              <Image
                src="/images/contents/kakaotalk.png"
                alt=""
                width={20}
                height={20}
                className={oauthLoginButtonIconClassName}
              />
              카카오로 시작하기
            </a>
          )}
          {googleAuthHref && (
            <a href={googleAuthHref} className={oauthGoogleLoginButtonClassName}>
              <Image
                src="/images/contents/google.png"
                alt=""
                width={20}
                height={20}
                className={oauthLoginButtonIconClassName}
              />
              구글로 시작하기
            </a>
          )}
        </div>
      </div>
    </DragHandleBottomSheet>
  );
}
